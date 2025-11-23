<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🥕 ZeroHunger Connect: Bridging Surplus to Need
## A Data-Driven Platform to End Food Waste and Insecurity

Our mission began with a clear purpose: to confront the paradox of **local food waste** occurring simultaneously with **rising household food insecurity**. We built ZeroHunger Connect to be the intelligent bridge—a seamless, efficient marketplace connecting local surplus directly to communities in urgent need.

This platform is custom-built to be intuitive for two distinct user groups and uses real-time data to drive impact.

---

## ✨ Key Features & Innovation

We made this project our own by implementing critical features and data infrastructure:

### 1. Two-Sided Dynamic Interface
The application starts with a clean **Role Selection** home page, giving users dedicated pathways:
* **Vendor Surplus Broadcast:** Allows verified businesses to quickly input food details and quantity, instantly broadcasting their surplus for pickup.
* **Charity & Shelter Access:** Provides a filtered feed and map view focused on claiming available donations and viewing high-need hotspot data.

### 2. Dynamic & Accurate Mapping
The application relies on dynamically loaded data, rather than static mock-ups, ensuring real-world accuracy:
* **Food Bank Locations:** Locations for local food assistance organizations are loaded directly from a structured CSV source (`clean_food_banks.csv`).
* **Insecurity Heatmap:** Hotspot data is loaded from a separate CSV (`ontario_phu_percentage.csv`), ensuring the visual map layer always reflects the latest, reliable household food insecurity statistics.

---

## 🚀 Run Locally

To get the application running on your machine, follow these steps.

**Prerequisites:**
* **Node.js** (required for `npm` and the development server)
* **Git** (required for version control)

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Configure API Key:** Set the `GEMINI_API_KEY` in your `.env.local` file to connect the AI Assistant and Vendor suggestions.
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
3.  **Start the app:**
    ```bash
    npm run dev
    ```
The application will launch in your browser at `http://localhost:3000`.
