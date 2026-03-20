# DrFarm Project Context

## Project Overview
**DrFarm** is an AI-powered agricultural assistance application designed to help farmers manage their crops, monitor market prices, and receive intelligent alerts about crop health and weather conditions.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Shadcn UI (Radix UI)
- **AI Integration**: Google Gemini (`@google/genai`)
- **Hosting/Backend**: Firebase (indicated by `.firebaserc`)

## Directory Structure
- `/studio`: Main Next.js application directory.
  - `/src/app`: Contains the application routes and pages.
    - `/alerts`: System alerts and notifications.
    - `/community`: Social/community features for farmers.
    - `/field`: Field management and monitoring.
    - `/mandi-prices`: Real-time market prices (Mandi).
    - `/marketplace`: Buy/Sell agricultural products.
    - `/news`: Agricultural news and updates.
    - `/profile`: User profiles and settings.
    - `/records`: Farm records and history.
    - `/scan`: AI-powered plant disease/health scanner.
    - `/schemes`: Information on government schemes.
  - `/src/components`: Reusable UI components (ScannerCTA, AlertCard, WeatherWidget, etc.).
  - `/src/lib`: Utility functions and API integrations (e.g., `audio-recorder.ts`).

## Core Features
1. **Market Intelligence**: Real-time tracking of crop prices (e.g., Local Wheat) with visual price trends.
2. **AI Scanner**: Implementation of a scanner (likely for disease detection) using Google Gemini.
3. **Advanced Weather Insights**: Location-specific weather updates tailored for farming.
4. **Crop Health Monitoring**: Alerts and intelligence regarding risks like "Yellow Rust" and NDVI satellite data.
5. **Irrigation & Focus**: Daily action items for farm management.
6. **Community & News**: Keeping farmers connected and informed.

## Current Development Status
- The project is in active development.
- Development server runs on `http://localhost:9002`.
- Recent focus has been on UI polishing with Framer Motion and integrating AI capabilities.

## Recent Changes Summary
- Simplified project structure.
- Implementation of `LiveAnalysis` and `AudioRecorder` components.
- Enhanced home page with glassmorphism and dynamic backgrounds.
