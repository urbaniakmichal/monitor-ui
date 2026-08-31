# 🖥️ Monitor System - Frontend UI

The user interface dashboard for the **Monitor System** infrastructure. It provides a clean, responsive web interface to visualize system states, interact with backend services, and monitor operations in real-time.

---

## 📋 Table of Contents
- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Running with Docker](#-running-with-docker)

---

## 🎯 About the Project

`monitor-ui` acts as the visual control center for the platform, communicating directly with the `monitor-system` backend API to display live data and system health metrics.

---

## 🛠️ Tech Stack

* **Framework/Library:** Modern Frontend Stack (React / Vue / Vite based)
* **Containerization:** Nginx & Docker

---

## 📦 Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (version 18+ recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/urbaniakmichal/monitor-ui.git
   cd monitor-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🐳 Running with Docker

To build and run the UI container independently or as part of the workspace:

```bash
docker build -t monitor-ui .
docker run -p 3001:80 monitor-ui
```

---

## 📄 License

This project is licensed under the MIT License.