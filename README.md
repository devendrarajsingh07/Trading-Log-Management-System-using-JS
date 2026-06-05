# Trading Log Management System

A full-stack web application for managing stock trading records, built with **React**, **Node.js**, **Express**, and **MySQL**.

## Overview
This project helps users record trades, calculate profit/loss, view analytics on a dashboard, search and filter trade history, export data as CSV, and fetch live market prices through an external API.

The original desktop version was converted into a modern browser-based application to make it easier to use, easier to deploy, and more suitable for academic and internship submissions.

## Features
- JWT-based login system
- Protected routes
- Add, view, edit, and delete trades
- Live price fetch from Alpha Vantage
- Search and filter by symbol, side, strategy, and remarks
- CSV export of trade records
- Dashboard summary cards
- Profit / loss bar chart
- Toast notifications
- Responsive design
- Logout functionality

## Tech Stack
**Frontend:** React, Vite, React Router, Axios, React Toastify, Chart.js  
**Backend:** Node.js, Express.js, JWT, bcryptjs  
**Database:** MySQL  
**Live Price API:** Alpha Vantage

## Folder Structure
```text
Trading-Log-Management-System-Web/
├── client/
├── server/
├── database/
├── docs/
│   ├── Trading_Log_Management_System_Report.docx
│   └── Trading_Log_Management_System_Report.pdf
└── README.md
```

## Setup Instructions

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables
Create a `server/.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trading_log_db
JWT_SECRET=your_secret_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_api_key
```

## Main API Endpoints
- `POST /api/auth/login`
- `GET /api/trades`
- `GET /api/trades/:id`
- `POST /api/trades`
- `PUT /api/trades/:id`
- `DELETE /api/trades/:id`
- `GET /api/trades/summary`
- `GET /api/trades/search`
- `GET /api/trades/export/csv`
- `GET /api/live-price/:symbol`

## Default Login
Use the credentials stored in the database seed/user table.

## Reports
- [Project Report DOCX](./docs/Trading_Log_Management_System_Report.docx)
- [Project Report PDF](./docs/Trading_Log_Management_System_Report.pdf)

## Notes
- Do not commit `.env` files to GitHub.
- Keep API keys secret.
- Add screenshots to a `screenshots/` folder for a polished repository.

<img width="1892" height="1001" alt="image" src="https://github.com/user-attachments/assets/527fd96c-0ff0-4d49-b10b-3302869ccfb7" />
<img width="1905" height="1064" alt="image" src="https://github.com/user-attachments/assets/ee0e7721-b1eb-455d-8393-e918070e3502" />
<img width="1885" height="1066" alt="image" src="https://github.com/user-attachments/assets/baa58764-ffa9-4e80-83f8-eb082f66921f" />
<img width="1873" height="993" alt="image" src="https://github.com/user-attachments/assets/3356c3a4-c39a-44de-93eb-52520ec393f0" />
<img width="1877" height="1000" alt="image" src="https://github.com/user-attachments/assets/74acf2b4-4d5e-4b5e-bc62-ae8258c92cdc" />
