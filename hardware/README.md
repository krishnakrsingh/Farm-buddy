# 🔌 Farm-Buddy Hardware Integration (Direct USB UART Architecture)

Zero Cloud • Zero Wi-Fi • 100% Direct Local Laptop Telemetry (&lt;10ms Latency)

---

## 🛠️ Hardware Specification

- **MCU**: ESP32-C3 Super Mini Development Board (USB CDC enabled)
- **Port**: `COM3` (USB-C connected directly to laptop)
- **Sensors**:
  - **MAX30102**: Optical Heart Rate & Pulse Oximeter (I2C: `0x57`)
  - **DS18B20**: Waterproof Temperature Probe (OneWire: `GPIO 4`)
  - **MPU6500**: 6-Axis Accelerometer & Gyroscope (I2C: `0x68`)

---

## 📌 Wiring Diagram (ESP32-C3 Super Mini)

| Sensor Pin | ESP32-C3 Pin | Notes |
| :--- | :--- | :--- |
| **MAX30102 SDA** | `GPIO 5` | Shared I2C Bus (400kHz) |
| **MAX30102 SCL** | `GPIO 7` | Shared I2C Bus (GPIO 6 broken, moved to 7) |
| **MPU6500 SDA** | `GPIO 5` | Shared I2C Bus |
| **MPU6500 SCL** | `GPIO 7` | Shared I2C Bus |
| **DS18B20 DATA** | `GPIO 4` | OneWire Bus + 4.7kΩ pull-up resistor to 3.3V |
| **All VCC** | `3.3V` | Continuous 3.3V power |
| **All GND** | `GND` | Common Ground |

---

## 🚀 Laptop Demo Setup Guide

1. **Plug ESP32 into Laptop USB-C Port** (`COM3`).
2. **Flash Firmware (if modifying code)**:
   ```powershell
   C:\Users\krish\bin\arduino-cli.exe compile --fqbn esp32:esp32:esp32c3:CDCOnBoot=cdc --upload --port COM3 hardware\esp32_sensor_node
   ```
3. **Open Web App Dashboard**:
   - Open `http://localhost:3000/hardware` in Google Chrome, Edge, or Brave.
4. **Click "Connect USB COM Port"**:
   - Select `COM3` / `USB JTAG/serial debug unit` in the browser popup.
   - Live sensor metrics (HR, SpO2, Temp, Motion, Posture) will immediately stream at **10 Hz (&lt;10ms latency)** across all pages!
