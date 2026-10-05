# System Architecture & Technical Specifications

## 1. Architectural Pattern
The application follows a decoupled client-server architecture with RESTful API communication:
- **Client**: Single Page Application (SPA) built with Vite, React 19, Tailwind CSS v4, and Recharts.
- **Server**: Express.js REST API providing data persistence via SQLite, CSV stream processing, JWT auth, and calculation services.
- **Database**: Embedded relational SQLite database engine with foreign keys enabled.

## 2. API Endpoint Directory

| Endpoint | Method | Description | Access |
|---|---|---|---|
| `/api/health` | GET | Server health check | Public |
| `/api/auth/login` | POST | User & Admin authentication | Public |
| `/api/analytics/dashboard` | GET | Aggregated KPIs, charts, and insights | Public |
| `/api/observations` | GET / POST | List & create usage records | Public |
| `/api/observations/:id` | DELETE | Delete observation record | Admin |
| `/api/surveys/stats` | GET | Aggregated survey metrics | Public |
| `/api/surveys/submit` | POST | Submit survey questionnaire | Public |
| `/api/locations` | GET / PUT | Campus hotspot diagnostic & risk edit | Public / Admin |
| `/api/campaigns` | GET / POST | Campaign tracking & creation | Public / Team |
| `/api/targets` | GET / PUT | Baseline & target reduction parameters | Public / Admin |
| `/api/impact/calculate` | POST | Environmental impact estimator engine | Public |
| `/api/reports/generate` | GET | Executive summary & report payload | Public |
| `/api/import/csv` | POST | Fieldwork CSV upload with validation | Admin / Team |
| `/api/export/csv` | GET | Download complete dataset CSV | Public |
| `/api/dataset/reset` | POST | Regenerate synthetic dataset | Admin |
| `/api/pledges` | GET / POST | Eco-pledge registration & statistics | Public |
