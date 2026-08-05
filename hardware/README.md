# 🔧 Farm-Buddy Hardware Setup Guide

## ESP32-C3 Super Mini Sensor Node — Wiring & Setup

### Components

| Component | Purpose | Interface |
|-----------|---------|-----------|
| ESP32-C3 Super Mini | WiFi gateway + processing | — |
| MAX30102 | Heart Rate + SpO2 | I2C (0x57) |
| DS18B20 | Body Temperature | OneWire |
| MPU6500 | Motion / Activity / Posture | I2C (0x68) |

### Wiring Diagram

```
                    ┌──────────────────────┐
                    │  ESP32-C3 Super Mini │
                    │                      │
  MAX30102 SDA ─────┤ GPIO 5 (SDA)        │
  MPU6500  SDA ─────┤                     │
                    │                      │
  MAX30102 SCL ─────┤ GPIO 6 (SCL)        │
  MPU6500  SCL ─────┤                     │
                    │                      │
  DS18B20  DATA ────┤ GPIO 4              │──── 4.7kΩ ──── 3.3V
                    │                      │
  All VCC ──────────┤ 3.3V                │
  All GND ──────────┤ GND                 │
                    └──────────────────────┘
```

> ⚠️ **Super Mini Note**: We use **GPIO 5/6** for I2C instead of the default 8/9 because:
> - GPIO 8 = onboard blue LED (strapping pin)
> - GPIO 9 = BOOT button (strapping pin)
> - Using 8/9 for I2C can cause boot failures if sensors pull the pins

> **Important**: The DS18B20 DATA line requires a **4.7kΩ pull-up resistor** to 3.3V!

### Physical Connections Summary

```
MAX30102 Module:
  VCC → 3.3V
  GND → GND
  SDA → GPIO 5
  SCL → GPIO 6

MPU6500 Module:
  VCC → 3.3V
  GND → GND
  SDA → GPIO 5  (same bus as MAX30102, different I2C address)
  SCL → GPIO 6  (same bus as MAX30102, different I2C address)

DS18B20 Probe:
  VCC (red)   → 3.3V
  GND (black) → GND
  DATA (yellow) → GPIO 4  +  4.7kΩ resistor between DATA and 3.3V
```

### Arduino IDE Setup

1. **Install ESP32 Board Support**:
   - File → Preferences → Additional Board URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board Manager → Search "esp32" → Install **esp32 by Espressif Systems**

2. **Select Board**: Tools → Board → **ESP32C3 Dev Module**
   - USB CDC On Boot: **Enabled**
   - Flash Size: 4MB
   - Upload Speed: 921600

3. **Install Libraries** (Sketch → Include Library → Manage Libraries):
   - `SparkFun MAX3010x Pulse and Proximity Sensor Library`
   - `DallasTemperature` (this auto-installs OneWire)
   - `ArduinoJson` (by Benoit Blanchon)

4. **Configure**:
   - Copy `config.h.example` to `config.h`
   - Set your WiFi SSID and password
   - Firebase URL is already pre-filled (`vitalink-57fe2`)

5. **Upload**: 
   - Connect Super Mini via USB-C
   - Select correct COM port
   - Hold BOOT button → Press RESET → Release BOOT (if upload fails)
   - Upload!

### Firebase (Already Done!)

Your Firebase Realtime Database is already configured:
- **Project**: `vitalink-57fe2`
- **DB URL**: `https://vitalink-57fe2-default-rtdb.firebaseio.com`

> Make sure your Realtime Database rules are set to test mode for the demo:
> ```json
> {
>   "rules": {
>     ".read": true,
>     ".write": true
>   }
> }
> ```

### Verifying It Works

1. Open Arduino Serial Monitor (115200 baud)
2. You should see:
   ```
   ╔══════════════════════════════════════════╗
   ║  Farm-Buddy ESP32-C3 Sensor Node v1.0   ║
   ╚══════════════════════════════════════════╝
   
   [MAX30102] Initializing... OK!
   [DS18B20]  Initializing... OK! Found 1 sensor(s)
   [MPU6500]  Initializing... OK! (ID: 0x70)
   [WiFi] Connected! IP: 192.168.1.x  RSSI: -45 dBm
   
   [Firebase] ✓ PUT OK | Temp: 38.5°C  HR: 62 bpm  SpO2: 97.2%
   ```
3. Check Firebase Console → Realtime Database → `/sensors/014` node updating in real-time
4. Open the Farm-Buddy dashboard → `/hardware` page shows live data!

### Troubleshooting

| Issue | Fix |
|-------|-----|
| Upload fails | Hold BOOT button while pressing RESET, then upload |
| `[MAX30102] NOT FOUND` | Check SDA/SCL wiring to GPIO 5/6 |
| `[DS18B20] NOT FOUND` | Check GPIO 4 wiring + 4.7kΩ pull-up resistor |
| `[MPU6500] NOT FOUND` | Check SDA/SCL + ensure AD0 pin is connected to GND (address 0x68) |
| `[Firebase] PUT FAILED` | Check WiFi connection + Firebase RTDB rules (must be test mode) |
| No serial output | Enable "USB CDC On Boot" in Arduino IDE board settings |
