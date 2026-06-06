<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/box.svg" width="80" height="80" alt="Box Art Lab Logo" />
  <h1 align="center">Box Art Lab</h1>
  <p align="center">
    <strong>A Next-Generation 3D Packaging Design Studio & Dynamic Quoting Engine</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#dynamic-pricing">Dynamic Pricing</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

---

## 🌟 Overview

**Box Art Lab** is a high-fidelity, interactive 3D web application designed to revolutionize how custom packaging is visualized, designed, and priced. Built for modern packaging studios, it empowers users to select from over **100+ product structures**, instantly customize 2D artwork using intelligent templates, and visualize the final product in real-time 3D. 

Coupled with a **Google Sheets-powered dynamic pricing engine**, Box Art Lab provides instant, accurate quotations scaled perfectly to custom dimensions and structural complexity.

---

## ✨ Key Features

### 🎨 Intelligent 2D/3D Design Studio
- **Real-Time 3D Rendering:** View packaging from any angle with physically-based rendering (PBR), dynamic lighting, and accurate shadows using **React Three Fiber**.
- **Live 2D Canvas Editor:** Built with **Fabric.js**, allowing users to upload logos, add text, and adjust layouts on the fly.
- **16+ Industry Templates:** Professionally crafted parametric design templates (Stripes, Hexagons, Circuits, Rose Gold, etc.) tailored for Food, Pharma, Fashion, E-commerce, and Luxury.
- **Dimension Sliders:** Instantly reshape the physical 3D box and recalibrate the 2D die-line canvas simultaneously.

### 💰 Dynamic Pricing Engine (Google Sheets)
- **Live Data Sync:** Connects directly to a Google Apps Script endpoint to fetch real-time pricing data.
- **Algorithmic Costing:** Calculates exact costs based on the product's base price, design premiums, and a unique `sizeVariationPct` that scales the price dynamically per centimeter above standard dimensions.
- **Instant Quotation UI:** A sleek cost-breakdown card updates in milliseconds as users adjust dimensions or design options.

### 📄 Professional Export & Lead Capture
- **PDF Quotation Generator:** Generates beautiful, comprehensive PDF quotes including the 3D render, customized specs, and pricing breakdown.
- **Integrated CRM:** Captures visitor leads and design preferences, funneling them instantly into your centralized Google Sheets CRM.

---

## 🛠️ Tech Stack

This project is engineered for maximum performance, modern aesthetics, and rapid iteration:

- **Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics:** [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (@react-three/drei)
- **2D Canvas:** [Fabric.js](http://fabricjs.com/)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (Animations) + [Lucide React](https://lucide.dev/) (Icons)
- **PDF Generation:** [jspdf](https://parall.ax/products/jspdf) & [html2canvas](https://html2canvas.hertzen.com/)
- **State Management:** React Context API
- **Backend/Data Source:** Google Apps Script (REST API) & Google Sheets

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/box-art-lab.git
   cd box-art-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Google Apps Script URL:
   ```env
   VITE_GOOGLE_SCRIPT_URL=your_google_apps_script_web_app_url
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *Your app will be running at `http://localhost:5173`.*

5. **Production Build**
   ```bash
   npm run build
   ```

---

## 📊 Dynamic Pricing Setup (Google Sheets)

Box Art Lab uses Google Sheets as a headless CMS for pricing and lead capture. 

1. Create a Google Sheet with two tabs: `Leads` and `Pricing`.
2. In the `Pricing` tab, add the following headers starting from `A1`:
   - `productId` (e.g., `pizza-box`)
   - `productName` (e.g., `Pizza Box`)
   - `category` (e.g., `Food`)
   - `basePrice` (INR cost for default dimensions)
   - `designPremium` (Extra cost for custom logo/design)
   - `sizeVariationPct` (Percentage increase per extra cm)
   - `maxDimension` (Slider limit in cm, e.g., 100)
3. Deploy the provided Apps Script (found in `src/lib/googleSheetsService.ts`) as a Web App and paste the URL into your `.env` file.

---

## 📁 Project Architecture

```
box-art-lab/
├── public/                 # Static assets (3D models, icons)
├── src/
│   ├── components/         # UI Components
│   │   ├── models/         # React Three Fiber 3D Box Components
│   │   ├── Canvas2D.tsx    # Fabric.js 2D Editor
│   │   ├── Preview3D.tsx   # Three.js viewport
│   │   └── ...
│   ├── context/            # Global State (PricingContext, PackagingContext)
│   ├── lib/                # Core Logic & Utilities
│   │   ├── designRules.ts  # 109+ Product Data & Dimensions
│   │   ├── designTemplates.ts # Template Configuration
│   │   ├── templateRenderers.ts # Fabric.js Drawing Engine
│   │   ├── pricingService.ts  # Google Sheets Fetcher
│   │   └── utils.ts        # Cost Calculation Algorithms
│   ├── pages/              # Main Route Pages (Home, Studio)
│   └── App.tsx             # Root Application Router
├── .env                    # Environment Variables
├── index.html              # Entry HTML
├── tailwind.config.ts      # Tailwind Configuration
└── vite.config.ts          # Vite Configuration
```

---

## 🤝 Contributing

We welcome contributions! If you'd like to improve the 3D models, add new templates, or optimize performance:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
<div align="center">
  <sub>Built with ❤️ by the Box Art Lab Team.</sub>
</div>
