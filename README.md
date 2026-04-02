# 🚀 99Sellers Pro: Deployment Guide

This repository is optimized for a monorepo deployment: **Next.js** on Vercel and **Node.js/MySQL** on Railway.

## 📦 Deployment Matrix

| Service | Platform | Root Directory |
| :--- | :--- | :--- |
| **Frontend** | Vercel | `frontend/` |
| **Backend** | Railway | `backend/` |
| **Database** | Railway | (MySQL Service) |

---

## 🛠️ Step-by-Step Launch

### 1. Railway (Backend & MySQL)
1.  **Add Service**: Link your GitHub repo and add a **MySQL** database.
2.  **Configure**: In the `backend` service settings, ensure **Root Directory** is `backend`.
3.  **Variables**: Add these to your **Backend Service** (using the `${{MySQL...}}` reference):
    - `MYSQLHOST`: `${{MySQL.MYSQLHOST}}`
    - `MYSQLPORT`: `${{MySQL.MYSQLPORT}}`
    - `MYSQLUSER`: `${{MySQL.MYSQLUSER}}`
    - `MYSQLPASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
    - `MYSQLDATABASE`: `${{MySQL.MYSQLDATABASE}}`
    - `NODE_ENV`: `production`
    - `JWT_SECRET`: (Your secret)
    - `PORT`: 5000

### 2. Vercel (Frontend)
1.  **Add Project**: Import this repo to Vercel.
2.  **Configure**: Set the **Root Directory** to `frontend`.
3.  **Variables**: 
    - `NEXT_PUBLIC_API_URL`: (Your Railway backend domain)

---

## 🔍 Debugging Database Connections
If you see `ECONNREFUSED` in the logs:
1.  Check the **Variables** tab in Railway.
2.  Ensure you have dragged a "link" between the Backend and MySQL boxes in the canvas.
3.  Look for `--- [DB SERVICE DISCOVERY] ---` in the logs to see if variables are reaching the app.

---

## 🚀 Status
The codebase is currently **Production-Ready** and synchronized with GitHub.
