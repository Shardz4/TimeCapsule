<div align="center">
  <img src="https://img.icons8.com/nolan/256/time-machine.png" alt="TimeCapsule Logo" width="150" height="150" />
  
  # ⏳ TimeCapsule
  
  **The Ethereal Digital Archive of Tomorrow.**
  <br />
  Preserving your memories, messages, and moments for the future in a beautifully crafted neo-nostalgic vault.

  <br />

  [![Backend](https://img.shields.io/badge/Backend-Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
  [![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br />

> ✨ **Version 2.0 Architectural Overhaul Complete!** We have entirely swapped out our legacy Python/Flask + SQLite structure with a high-performance **Golang + PostgreSQL** engine. The frontend has been beautifully reimagined using a deeply atmospheric **Glassmorphism/Neo-Nostalgic** design language via **Vite + React + TailwindCSS**!

---

## 🌌 Features

- 📝 **Create Digital Capsules**: Store thoughts, reflections, and deep memories in a secure digital vault. 
- 🕰️ **Set Precise Unlock Dates**: Choose the exact moment your capsule can be accessed—whether it's days, months, or years into the future.
- 🌎 **Global Echoes (Public Vault)**: Opt into sharing your memories on the global public feed or strictly seal them for personal stakeholders.
- ⚡ **Blazing Fast**: Rebuilt entirely in Golang with concurrent architecture over PostgreSQL for instant reads and seamless writes.
- 🎨 **Neo-Vault UI**: A gorgeous, reactive Single Page Application (SPA) utilizing gradient overlays, translucent glass panels, and breathtaking typography.

---

## 🏗️ Repository Architecture

Our folder structure is rigorously split to optimize full-stack scalability:
```text
TimeCapsule/
├── 📁 backend/    # High-Performance Golang HTTP Server connected to PostgreSQL
├── 📁 frontend/   # Stunning React/Vite SPA styled strictly with TailwindCSS
└── 📁 onchain/    # 🔒 [Reserved] Empty workspace mapped for upcoming Web3 integration
```

*(Note: Legacy sentiment analytics and deprecated blockchain stubs are actively removed to maximize CRUD throughput and user experience.)*

---

## 🚀 Getting Started

You'll need both sections of the module running to interact with your archives.

### 1. The Database & Backend 💙
Ensure you have Docker and Go runtime installed.
```bash
# 1. Spin up the Postgres database (Make sure Docker is running)
docker run --name timecaps-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=capsules -p 5432:5432 -d postgres

# 2. Enter the backend sector
cd backend

# 3. Boot the Golang Server
go run main.go
```
*Your ultra-fast backend will now be safely humming on `http://localhost:8080`.*

### 2. The Frontend 💜
Ensure you have Node.js installed.
```bash
# 1. Open a separate terminal and jump into the UI workspace
cd frontend

# 2. Install dependencies (First run only)
npm install

# 3. Launch the Vite Dev Server
npm run dev
```
*Head over to the URL shown in your terminal (usually `http://localhost:5173`) to immerse yourself in the Vault!*

---

## 🤝 Acknowledgements
- Built with ❤️ utilizing cutting-edge web primitives.
- Inspired by the raw human desire to preserve moments amidst the fleeting passage of time.
