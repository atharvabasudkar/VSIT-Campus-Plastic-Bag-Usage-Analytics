# Campus Plastic Bag Usage and Reduction Analysis

### Institution
**Vidyalankar School of Information Technology (VSIT)**  
Department of Information Technology & Science  
Academic Year: 2024–2025

---

> ⚠️ **IMPORTANT SYNTHETIC DATASET DISCLAIMER**  
> Synthetic dataset generated for academic demonstration and system testing. It does not represent officially measured VSIT plastic consumption.

---

## 1. Project Title & Overview
**VSIT Campus Plastic Bag Usage and Reduction Analysis** is a data-driven web application and sustainability management system built for college CEP demonstration, viva presentation, fieldwork data collection, and administrative policy formulation.

The platform converts raw campus observations into actionable environmental insights, tracking single-use plastic carry bag usage across canteens, stationery shops, campus events, and academic departments.

---

## 2. Project Objectives
- How many plastic bags are being used on campus daily and monthly?
- Which campus locations generate the highest plastic bag waste (Hotspots)?
- What types of plastic bags (Thin, Medium, Large, Food Packaging) are most commonly used?
- Why are students and staff using plastic bags?
- How much plastic waste (in kg) is generated?
- What percentage of plastic usage can be avoided?
- Are reusable cloth bags being adopted?
- How effective are campus awareness drives?
- What percentage reduction has been achieved against baseline metrics?

---

## 3. Technology Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (v4) with Glassmorphic aesthetics & Dark Green Theme
- **Data Visualizations**: Recharts (Area, Bar, Donut charts)
- **Icons**: Lucide Icons (`lucide-react`)
- **Effects & PDF**: Canvas Confetti, HTML2Canvas, JSPDF

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: SQLite (`better-sqlite3`)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **CSV Engine**: `csv-parser` & `csv-writer`
- **File Upload**: `multer`

---

## 4. System Architecture

```
e:\CEP PROJECT/
├── backend/
│   ├── database/
│   │   ├── cep_database.sqlite
│   │   └── database.js
│   ├── dataset/
│   │   ├── VSIT_Campus_Plastic_Bag_Usage_Dataset.csv
│   │   └── generate_dataset.js
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── observations.js
│   │   ├── surveys.js
│   │   ├── locations.js
│   │   ├── campaigns.js
│   │   ├── targets.js
│   │   ├── impact.js
│   │   ├── reports.js
│   │   ├── importExport.js
│   │   ├── auth.js
│   │   └── pledges.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── dataset/
│   └── VSIT_Campus_Plastic_Bag_Usage_Dataset.csv
├── documentation/
│   └── ARCHITECTURE.md
└── README.md
```

---

## 5. Database Schema & Tables

1. `users`: Stores admin and team accounts with hashed passwords.
2. `plastic_usage_records`: Observation records including date, user category, department, location, bag type, count, weight, and plastic avoidable status.
3. `survey_responses`: Student and staff 15-question survey submissions.
4. `campus_locations`: Campus hotspots with assigned risk levels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`) and recommended actions.
5. `campaigns`: Awareness drives tracking target vs. actual reduction.
6. `reduction_targets`: Baseline vs current vs target goals.
7. `pledges`: Student and staff eco-pledges signed.

---

## 6. Reduction Formula & Sustainability Score

### Baseline Reduction Formula
$$\text{Reduction \%} = \frac{\text{Baseline Usage} - \text{Current Usage}}{\text{Baseline Usage}} \times 100$$

### VSIT Plastic Reduction Score (0–100)
$$\text{Score} = 0.25(\text{Reusable Adoption \%}) + 0.20(\text{Reduction vs Target}) + 0.20(\text{Awareness Rate}) + 0.20(100 - \text{Avoidable \%}) + 0.15(\text{Campaign Exposure})$$

---

## 7. Default Demo Login Credentials

- **Admin Email**: `admin@vsit.edu.in`
- **Admin Password**: `admin123`
- **CEP Team Email**: `cep_team@vsit.edu.in`
- **CEP Team Password**: `team123`

---

## 8. Installation & How to Run

### Step 1: Start Backend Server
```bash
cd backend
npm install
node server.js
```
The Express backend runs on `http://localhost:5000`.

### Step 2: Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 9. CEP Fieldwork CSV Import Support
Students collecting real fieldwork observations using Excel/Google Sheets can upload their `.csv` via the **Admin Portal** or **Fieldwork Import Modal**.

The system validates mandatory columns (`date`, `campus_location`, `bag_type`, `bags_used`) before committing records to the SQLite database.

---

## 10. Future Scope
- QR Code tracking on reusable cloth bags.
- IoT-enabled smart waste bin weight sensors.
- AI Computer Vision for canteen waste classification.
- Integration with VSIT student green rewards leaderboard.
