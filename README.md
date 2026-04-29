# Inventory Management Frontend

A modern, scalable inventory management interface built with React and TypeScript, following the **Feature Sliced Design (FSD)** architectural methodology.

## 🚀 Tech Stack

* **Core:** React & TypeScript
* **Architecture:** Feature Sliced Design (FSD)
* **State Management:** Redux Toolkit (RTK)
* **Data Fetching:** RTK Query (caching and automated re-fetching)
* **UI Components:** React-Bootstrap
* **Interactions:** Drag and Drop (DnD) integration
* **Forms:** Formik & Yup (validation)
* **Data Grids:** TanStack Table (React Table)
* **Internationalization:** i18next (with `i18next-http-backend` for async loading)
* **Build Tooling:** Webpack (custom configuration for bundle optimization)

## 🏗 Architecture Overview

The project is structured according to **FSD** principles to ensure high maintainability and clear separation of concerns:

* **app**: Global setup (Providers, Styles, Routing).
* **pages**: Composition of full application screens.
* **widgets**: Complex UI units combining features and entities.
* **features**: User interactions that carry business value (e.g., "Add to Stock").
* **entities**: Business logic for core objects (Products, Suppliers, Users).
* **shared**: Reusable UI components, API clients, and utility functions.

## ✨ Key Features

* **Drag and Drop Interface:** Intuitive DnD capabilities for reordering items or managing categories.
* **Full CRUD Support:** Comprehensive management of products, categories, and vendors.
* **Advanced Data Tables:** Highly performant tables featuring filtering, and pagination via TanStack Table.
* **Dynamic Localization:** Multi-language support with asynchronous locale file loading.
* **Performance Optimized:** Implements code-splitting using `React.lazy` and `Suspense`.
* **Responsive UI:** Fully adaptive design optimized for various screen sizes using Bootstrap.

## 🛠 Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/lazysl0th/inventory-management-frontend.git](https://github.com/lazysl0th/inventory-management-frontend.git)
   cd inventory-management-frontend

   ## 🛠 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/lazysl0th/inventory-management-frontend.git
cd inventory-management-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a .env file:
```env
REACT_APP_API_URL=your_api_endpoint_here
```

### 4. Start
```bash
npm run dev
```