# 🩺 VitalSense: AI-Powered Health Companion

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> *"Healthcare should be accessible, intelligent, and immediate. VitalSense bridges the gap between confusion and clarity."*

---

## 👨‍💻 Why I Built This
**I realized that Googling symptoms is a nightmare.** You type in "headache" and leave convinced you have a rare terminal illness. I wanted to build something different—an interface that feels calm, authoritative, and empathetic.

**VitalSense** isn't just a symptom checker; it's an attempt to humanize digital health. I built this to master **TypeScript** and **Complex State Management**, but it evolved into a study of how AI can guide users through high-stress moments without causing panic.

---

## 🚀 Overview
**VitalSense** is a Next-Gen health companion built to democratize access to preliminary medical insights. It leverages a local inference engine to analyze user symptoms against a database of 700+ conditions to provide instant, triage-level guidance.

### Key Features
* **🤖 Smart Triage System:** Classifies results into "Emergency," "Consult Doctor," or "Self-Care" based on severity logic.
* **🏥 Doctor Locator:** Integrated geolocation features to find the nearest specialists based on the predicted condition.
* **🔒 Privacy-First:** Consultation history is encrypted and stored locally, ensuring sensitive health data stays private.

---

## 🏗️ Technical Architecture

The application follows a modular, component-driven architecture:
* **Frontend:** React 18 with TypeScript for type-safe component logic.
* **State Management:** React Context API + Custom Hooks for managing the "Diagnostic Flow."
* **Styling:** Tailwind CSS + Framer Motion for smooth, calming UI interactions.

---

## ⚡ Getting Started

### Prerequisites
* Node.js 18+ installed
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sahilistrying/VitalSense-AI.git
    cd VitalSense-AI
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    *The app will launch at http://localhost:5173*

---

## 🔮 Future Roadmap
* [ ] **Telemedicine Integration:** WebRTC implementation for direct video calls with doctors.
* [ ] **Wearable Sync:** Connection to Apple Health/Google Fit APIs.
* [ ] **Multi-Language Support:** i18n implementation for non-English speakers.

---

<p align="center">
  <i>Built by Sahil. Merging AI with empathy.</i>
</p>