# EcoTriage - Emergency Hazard Intelligence

> "Keep Emergency Routes Moving. Even When Networks Go Dark."
> Built by Team Webuzz for Visakhapatnam Municipal Corporation (GVMC), Andhra Pradesh, India.

---

## 🌪️ Overview

After coastal cyclones and severe squalls, municipal authorities lose critical hours identifying, verifying, and ranking blocked roads due to chaotic, unorganized communications. Blocked roads delay ambulance lifelines, rescue boats, medical supplies, and power restoration.

**EcoTriage** provides:
1. **Operations Side**: Field squads capture hazard photos and GPS. The integrated multimodal AI triage model analyzes obstructions and live electrical hazards to calculate an automated priority score (0–10). Command officers view a live, color-coded map and queue to dispatch heavy machinery and wire isolation crews.
2. **Public-Help Side**: Citizens find nearby relief camps with real-time free bed capacities, emergency trauma centers, safety precautions, historical cyclone records, and community responder tributes.
3. **Offline-First Resilience**: All reporting, caching, and state transitions persist in `localStorage` and `IndexedDB`. When the network goes down, reports are queued locally and automatically synchronized as soon as connectivity resumes.

---

## 🚀 Key Features

- **Multimodal AI Vision & Rule Scoring**: Evaluates complete road blocks (+3.0), live electrical wires (+2.5), and hospital lifelines (+1.5) with automatic fallback scoring.
- **Interactive Operational Map**: Color-coded severity pins (Critical 9.0+, High, Medium, Low), hospital route overlays, and offline schematic fallback.
- **Triage Assessment Drawer**: Inspects damage photos, road metadata, nearest vital facilities (depots, camps, hospitals), and crew dispatch actions.
- **Trilingual Accessibility**: Full support for English, Telugu (తెలుగు), and Hindi (हिन्दी) plus a **Simple Words Mode** for high-stress emergency reading.
- **Role-Based Workflows**: Public, Viewer, Field Officer, Command Officer, and System Admin roles with simulated 4-digit PIN authentication.

---

## 💻 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment Secrets**:
   Create a `.env` file from `.env.example`:
   ```bash
   GEMINI_API_KEY="your-google-ai-studio-api-key"
   PORT=3000
   ```
3. **Start the full-stack development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run unit tests**:
   ```bash
   npm test
   ```

---

## 🚢 Production Deployment

1. **Build the production bundle**:
   ```bash
   npm run build
   ```
2. **Start the production server**:
   ```bash
   npm start
   ```
3. **Hosting on Cloud Run / Vercel / Railway**:
   - Provide `GEMINI_API_KEY` in your hosting dashboard secrets.
   - Entry point: `server.ts` (runs Express on port 3000 with Vite production static middleware).

---

## 🧪 5-Step Verification Checklist

1. **Report a Hazard**: Click the red "Report Hazard" button. Select "SMS Text Report", click "Read & Extract Message", and click "Submit report". Observe the AI Result Card calculate priority 10.0 (Critical) with live wire danger and equipment recommendation.
2. **Offline-First Queuing & Auto-Sync**: Toggle the network status pill in the top ticker to "Offline". Submit a hazard. Notice the amber "Saved. Will send when network returns" banner. Toggle back to "Online" and verify the green toast "queued report(s) synced successfully!".
3. **Filter the Live Map**: Navigate to "Live Map". Click the filter chips ("Critical", "Hospital Routes", "Relief Camps"). Click an incident pin to open the Triage Drawer.
4. **Dispatch Squad from Triage Drawer**: Click "Staff sign in" -> select "Command Officer" (PIN: 1234). In the Triage Drawer, click "Send Crew", pick an available squad, and observe the status instantly update to "Assigned" with the timeline event.
5. **Switch Language & Role**: Click "తెలుగు" in the header and verify that the hero headline, subline, and action buttons switch to native Telugu. Click "Switch user" and test Admin or Field Officer roles.

---

## 🔮 5 Ideas for the Next Version

1. **Direct WebBluetooth & LoRa Mesh Bridge**: Hardware bridge to transmit compact 64-byte hazard packets over off-grid LoRa radio transceivers.
2. **Automated Road Routing & Detour Engine**: Turn-by-turn civic GPS navigation that automatically routes ambulances away from roads marked "Complete Block" or "Live Wire".
3. **Crowdsourced Photo Deduplication**: Geospatial clustering that groups multiple photos of the same fallen banyan tree into a single master incident with consensus validation.
4. **Municipal Machinery Telematics**: Real-time GPS tracking of bulldozers, cranes, and chainsaw squads displaying ETA on the command map.
5. **Voice Interactive IVR Hotline**: Automated voice triage in Telugu, Hindi, and English for citizens calling from 2G feature phones without internet access.
