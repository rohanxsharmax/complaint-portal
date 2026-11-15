# complaint-portal
# ResolveDesk – Complaint Management Portal

A simple, modern, and fully client-side **Complaint Management System** that allows users to submit, track, and manage complaints with ease.

**Live Demo:** [https://resolvedesk-eta.vercel.app/](https://resolvedesk-eta.vercel.app/)

---

## Features

- **Submit Complaints**
  - Full Name & Email
  - Category (Service, Billing, Product, Technical Issue, Other)
  - Priority (Low / Medium / High)
  - Subject & Detailed Description
  - Optional file attachment

- **Real-time Dashboard**
  - Total Complaints
  - Open
  - In Progress
  - Resolved

- **Track & Manage Complaints**
  - Search by Tracking ID, Name, or Subject
  - Filter by Status
  - Update complaint status directly from the table (Open → In Progress → Resolved)
  - Unique Tracking ID generated for every complaint (e.g. `CMP-xxxxxx`)

- **Tracking by ID**
  - Quick lookup of any complaint using its Tracking ID

- **Data Persistence**
  - All data is stored in the browser’s `localStorage`
  - Works completely offline after the first load
  - Sample complaints included for demonstration

---

## Tech Stack

- **HTML5**
- **CSS3** (Responsive design)
- **JavaScript**
- **localStorage** (No backend / database required)
- Deployed on **Vercel**
