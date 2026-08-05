/*
 * ═══════════════════════════════════════════════════════════════
 *  Farm-Buddy ESP32-C3 Super Mini Sensor Node
 *  Real-time livestock health telemetry → Firebase → Vercel Dashboard
 * ═══════════════════════════════════════════════════════════════
 *
 *  Hardware:
 *    - ESP32-C3 Super Mini Board
 *    - MAX30102 Heart Rate + SpO2 Sensor (I2C: 0x57)
 *    - DS18B20 Waterproof Temperature Probe (OneWire)
 *    - MPU6500 6-Axis IMU Accelerometer/Gyro (I2C: 0x68)
 *
 *  Wiring (ESP32-C3 Super Mini):
 *    GPIO 5 (SDA) → MAX30102 SDA + MPU6500 SDA  (shared I2C bus)
 *    GPIO 6 (SCL) → MAX30102 SCL + MPU6500 SCL  (shared I2C bus)
 *    GPIO 4       → DS18B20 DATA (4.7kΩ pull-up to 3.3V)
 *    3.3V         → All sensor VCC
 *    GND          → All sensor GND
 *
 *  NOTE: GPIO 8 (onboard LED) and GPIO 9 (BOOT button) are strapping
 *        pins on the Super Mini — we avoid them for I2C to prevent
 *        boot conflicts.
 *
 *  Required Arduino Libraries (install via Library Manager):
 *    1. SparkFun MAX3010x Pulse and Proximity Sensor Library
 *    2. DallasTemperature
 *    3. OneWire
 *    4. ArduinoJson
 *
 *  Board: ESP32C3 Dev Module (in Arduino Board Manager)
 *  
 *  Setup: Copy config.h.example → config.h and set your WiFi + Firebase URL
 */

#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <MAX30105.h>          // SparkFun MAX3010x library (works for MAX30102)
#include <heartRate.h>         // Heart rate calculation algorithm
#include "config.h"

// ════════════════════════════════════════
//  Sensor Objects
// ════════════════════════════════════════

MAX30105 particleSensor;       // MAX30102 HR + SpO2
OneWire oneWire(DS18B20_PIN);
DallasTemperature tempSensor(&oneWire);

// MPU6500 registers
#define MPU6500_ADDR    0x68
#define MPU6500_WHO_AM_I 0x75
#define MPU6500_PWR_MGMT_1 0x6B
#define MPU6500_ACCEL_XOUT_H 0x3B
#define MPU6500_GYRO_XOUT_H 0x43
#define MPU6500_ACCEL_CONFIG 0x1C

// ════════════════════════════════════════
//  Heart Rate Tracking Variables
// ════════════════════════════════════════

const byte RATE_SIZE = 8;       // Averaging window
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute = 0;
int beatAvg = 0;

// ════════════════════════════════════════
//  Global Sensor State
// ════════════════════════════════════════

float currentTemp = 0.0;
int currentHR = 0;
float currentSpO2 = 97.0;     // Simplified SpO2 estimation
float accelX = 0, accelY = 0, accelZ = 0;
float gyroX = 0, gyroY = 0, gyroZ = 0;
float activityLevel = 0.0;
String posture = "unknown";
bool sensorsReady = false;

unsigned long lastSendTime = 0;
unsigned long lastTempRead = 0;
int sendCount = 0;

// Status tracking
bool max30102_ok = false;
bool ds18b20_ok = false;
bool mpu6500_ok = false;
bool wifi_connected = false;

// ════════════════════════════════════════
//  SETUP
// ════════════════════════════════════════

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println();
    Serial.println("╔══════════════════════════════════════════╗");
    Serial.println("║  Farm-Buddy ESP32-C3 Sensor Node v1.0   ║");
    Serial.println("║  Cow #014 — Live Telemetry Gateway      ║");
    Serial.println("╚══════════════════════════════════════════╝");
    Serial.println();

    // Initialize I2C
    Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);
    Wire.setClock(400000); // 400kHz Fast I2C
    
    // Initialize sensors
    initMAX30102();
    initDS18B20();
    initMPU6500();
    
    // Connect WiFi
    connectWiFi();
    
    Serial.println();
    Serial.println("━━━ Sensor Status ━━━━━━━━━━━━━━━━━━━━━━━━");
    Serial.printf("  MAX30102 (HR/SpO2): %s\n", max30102_ok ? "✓ ONLINE" : "✗ OFFLINE");
    Serial.printf("  DS18B20  (Temp)   : %s\n", ds18b20_ok ? "✓ ONLINE" : "✗ OFFLINE");
    Serial.printf("  MPU6500  (Motion) : %s\n", mpu6500_ok ? "✓ ONLINE" : "✗ OFFLINE");
    Serial.printf("  WiFi              : %s\n", wifi_connected ? "✓ CONNECTED" : "✗ DISCONNECTED");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Serial.println();
    
    sensorsReady = true;
}

// ════════════════════════════════════════
//  MAIN LOOP
// ════════════════════════════════════════

void loop() {
    // Continuously read MAX30102 (needs high-frequency polling for HR detection)
    if (max30102_ok) {
        readMAX30102();
    }
    
    // Read temperature every 1 second (DS18B20 is slow)
    if (ds18b20_ok && (millis() - lastTempRead > 1000)) {
        readDS18B20();
        lastTempRead = millis();
    }
    
    // Read MPU6500 accelerometer/gyro
    if (mpu6500_ok) {
        readMPU6500();
    }
    
    // Send data to Firebase at configured interval
    if (millis() - lastSendTime >= SEND_INTERVAL_MS) {
        if (wifi_connected) {
            sendToFirebase();
        } else {
            // Try to reconnect
            connectWiFi();
        }
        lastSendTime = millis();
    }
}

// ════════════════════════════════════════
//  MAX30102 — Heart Rate + SpO2
// ════════════════════════════════════════

void initMAX30102() {
    Serial.print("[MAX30102] Initializing... ");
    
    if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
        Serial.println("NOT FOUND! Check wiring.");
        max30102_ok = false;
        return;
    }
    
    // Configure for heart rate detection
    particleSensor.setup();
    particleSensor.setPulseAmplitudeRed(0x0A);   // Low power for proximity detection
    particleSensor.setPulseAmplitudeGreen(0);     // Turn off green LED
    
    // Optimize for finger/ear placement
    particleSensor.setup(60, 4, 2, 400, 411, 4096);
    
    Serial.println("OK!");
    max30102_ok = true;
}

void readMAX30102() {
    long irValue = particleSensor.getIR();
    
    // Check if finger/sensor is placed (IR > 50000 means something is detected)
    if (irValue > 50000) {
        if (checkForBeat(irValue)) {
            long delta = millis() - lastBeat;
            lastBeat = millis();
            
            beatsPerMinute = 60.0 / (delta / 1000.0);
            
            // Sanity check: valid heart rate range for cattle (40-120 bpm)
            if (beatsPerMinute > 30 && beatsPerMinute < 150) {
                rates[rateSpot++] = (byte)beatsPerMinute;
                rateSpot %= RATE_SIZE;
                
                // Calculate running average
                beatAvg = 0;
                for (byte x = 0; x < RATE_SIZE; x++) {
                    beatAvg += rates[x];
                }
                beatAvg /= RATE_SIZE;
                currentHR = beatAvg;
            }
        }
        
        // Simplified SpO2 estimation from red/IR ratio
        long redValue = particleSensor.getRed();
        if (redValue > 0 && irValue > 0) {
            float ratio = (float)redValue / (float)irValue;
            // Simplified SpO2 approximation (not medical grade)
            currentSpO2 = constrain(110.0 - 25.0 * ratio, 80.0, 100.0);
        }
    } else {
        // No finger/sensor contact — use simulated baseline for demo
        if (currentHR == 0) {
            currentHR = BASELINE_HR + random(-3, 4);
            currentSpO2 = 95.0 + random(0, 5) * 0.1;
        }
    }
}

// ════════════════════════════════════════
//  DS18B20 — Body Temperature
// ════════════════════════════════════════

void initDS18B20() {
    Serial.print("[DS18B20]  Initializing... ");
    tempSensor.begin();
    
    if (tempSensor.getDeviceCount() == 0) {
        Serial.println("NOT FOUND! Check wiring (GPIO 4 + 4.7kΩ pullup).");
        ds18b20_ok = false;
        return;
    }
    
    tempSensor.setResolution(12);  // 12-bit = 0.0625°C precision
    tempSensor.setWaitForConversion(false); // Async reads
    tempSensor.requestTemperatures();
    
    Serial.printf("OK! Found %d sensor(s)\n", tempSensor.getDeviceCount());
    ds18b20_ok = true;
}

void readDS18B20() {
    float temp = tempSensor.getTempCByIndex(0);
    
    if (temp != DEVICE_DISCONNECTED_C && temp > -10.0 && temp < 50.0) {
        currentTemp = temp;
    } else if (currentTemp == 0.0) {
        // Fallback if sensor disconnects during demo
        currentTemp = BASELINE_TEMP + random(-5, 6) * 0.1;
    }
    
    // Request next async conversion
    tempSensor.requestTemperatures();
}

// ════════════════════════════════════════
//  MPU6500 — 6-Axis Motion/Activity
// ════════════════════════════════════════

void initMPU6500() {
    Serial.print("[MPU6500]  Initializing... ");
    
    // Check WHO_AM_I register
    Wire.beginTransmission(MPU6500_ADDR);
    Wire.write(MPU6500_WHO_AM_I);
    Wire.endTransmission(false);
    Wire.requestFrom((uint8_t)MPU6500_ADDR, (uint8_t)1);
    
    uint8_t whoAmI = Wire.read();
    
    // MPU6500 WHO_AM_I should be 0x70, MPU9250 is 0x71
    if (whoAmI != 0x70 && whoAmI != 0x71 && whoAmI != 0x73) {
        Serial.printf("NOT FOUND (WHO_AM_I: 0x%02X). Check wiring.\n", whoAmI);
        mpu6500_ok = false;
        return;
    }
    
    // Wake up MPU6500 (clear sleep bit)
    writeRegister(MPU6500_ADDR, MPU6500_PWR_MGMT_1, 0x00);
    delay(100);
    
    // Set accelerometer range to ±4g
    writeRegister(MPU6500_ADDR, MPU6500_ACCEL_CONFIG, 0x08);
    
    Serial.printf("OK! (ID: 0x%02X)\n", whoAmI);
    mpu6500_ok = true;
}

void readMPU6500() {
    // Read accelerometer (6 bytes: XH,XL,YH,YL,ZH,ZL)
    Wire.beginTransmission(MPU6500_ADDR);
    Wire.write(MPU6500_ACCEL_XOUT_H);
    Wire.endTransmission(false);
    Wire.requestFrom((uint8_t)MPU6500_ADDR, (uint8_t)6);
    
    int16_t rawAX = (Wire.read() << 8) | Wire.read();
    int16_t rawAY = (Wire.read() << 8) | Wire.read();
    int16_t rawAZ = (Wire.read() << 8) | Wire.read();
    
    // Convert to g (±4g range, 8192 LSB/g)
    accelX = rawAX / 8192.0;
    accelY = rawAY / 8192.0;
    accelZ = rawAZ / 8192.0;
    
    // Read gyroscope (6 bytes)
    Wire.beginTransmission(MPU6500_ADDR);
    Wire.write(MPU6500_GYRO_XOUT_H);
    Wire.endTransmission(false);
    Wire.requestFrom((uint8_t)MPU6500_ADDR, (uint8_t)6);
    
    int16_t rawGX = (Wire.read() << 8) | Wire.read();
    int16_t rawGY = (Wire.read() << 8) | Wire.read();
    int16_t rawGZ = (Wire.read() << 8) | Wire.read();
    
    gyroX = rawGX / 131.0;  // °/s (±250°/s range)
    gyroY = rawGY / 131.0;
    gyroZ = rawGZ / 131.0;
    
    // Calculate activity level (magnitude of acceleration deviation from 1g)
    float accelMag = sqrt(accelX * accelX + accelY * accelY + accelZ * accelZ);
    float gyroMag = sqrt(gyroX * gyroX + gyroY * gyroY + gyroZ * gyroZ);
    
    // Activity = how much total motion deviates from resting (1g gravity + 0 rotation)
    activityLevel = constrain((abs(accelMag - 1.0) * 5.0 + gyroMag * 0.02), 0.0, 1.0);
    
    // Posture detection: if Z-axis acceleration is dominant → standing
    // If X or Y axis dominant → lying down
    if (abs(accelZ) > 0.7) {
        posture = "standing";
    } else if (abs(accelX) > 0.6 || abs(accelY) > 0.6) {
        posture = "lying";
    } else {
        posture = "moving";
    }
}

// ════════════════════════════════════════
//  WiFi Connection
// ════════════════════════════════════════

void connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) {
        wifi_connected = true;
        return;
    }
    
    Serial.printf("[WiFi] Connecting to '%s'", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 40) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        wifi_connected = true;
        Serial.printf("\n[WiFi] Connected! IP: %s  RSSI: %d dBm\n", 
                      WiFi.localIP().toString().c_str(), WiFi.RSSI());
    } else {
        wifi_connected = false;
        Serial.println("\n[WiFi] Connection FAILED. Will retry...");
    }
}

// ════════════════════════════════════════
//  Firebase Data Push
// ════════════════════════════════════════

void sendToFirebase() {
    // Build JSON payload
    StaticJsonDocument<512> doc;
    
    doc["cowId"] = COW_ID;
    doc["tagId"] = TAG_ID;
    doc["shed"] = SHED_NAME;
    doc["temp"] = round(currentTemp * 10.0) / 10.0;  // 1 decimal place
    doc["hr"] = currentHR;
    doc["spo2"] = round(currentSpO2 * 10.0) / 10.0;
    doc["activityLevel"] = round(activityLevel * 100.0) / 100.0;
    doc["posture"] = posture;
    doc["accelX"] = round(accelX * 100.0) / 100.0;
    doc["accelY"] = round(accelY * 100.0) / 100.0;
    doc["accelZ"] = round(accelZ * 100.0) / 100.0;
    doc["gyroX"] = round(gyroX * 10.0) / 10.0;
    doc["gyroY"] = round(gyroY * 10.0) / 10.0;
    doc["gyroZ"] = round(gyroZ * 10.0) / 10.0;
    doc["timestamp"] = millis() / 1000;
    doc["deviceId"] = DEVICE_ID;
    doc["rssi"] = WiFi.RSSI();
    doc["uptimeSeconds"] = millis() / 1000;
    doc["sendCount"] = ++sendCount;
    
    // Sensor status flags
    doc["sensors"]["max30102"] = max30102_ok;
    doc["sensors"]["ds18b20"] = ds18b20_ok;
    doc["sensors"]["mpu6500"] = mpu6500_ok;
    
    String jsonPayload;
    serializeJson(doc, jsonPayload);
    
    // Firebase REST API: PUT to /sensors/014.json
    String url = "https://" + String(FIREBASE_HOST) + "/sensors/" + String(COW_ID) + ".json";
    if (strlen(FIREBASE_AUTH) > 0) {
        url += "?auth=" + String(FIREBASE_AUTH);
    }
    
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.PUT(jsonPayload);
    
    if (httpResponseCode == 200) {
        Serial.printf("[Firebase] ✓ PUT OK | Temp: %.1f°C  HR: %d bpm  SpO2: %.1f%%  Activity: %.2f  Posture: %s  RSSI: %d\n",
                      currentTemp, currentHR, currentSpO2, activityLevel, posture.c_str(), WiFi.RSSI());
    } else {
        Serial.printf("[Firebase] ✗ PUT FAILED (HTTP %d): %s\n", httpResponseCode, http.errorToString(httpResponseCode).c_str());
    }
    
    http.end();
}

// ════════════════════════════════════════
//  I2C Helper
// ════════════════════════════════════════

void writeRegister(uint8_t addr, uint8_t reg, uint8_t value) {
    Wire.beginTransmission(addr);
    Wire.write(reg);
    Wire.write(value);
    Wire.endTransmission();
}
