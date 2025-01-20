# E-Learning Platform

This project is an E-Learning platform that allows users to create, purchase, and enroll in courses. It includes both a backend and a frontend.

## Live Site

Check out the live site [here](https://e-learning-80kp.onrender.com/).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Course creation and management
- Lecture creation and management
- Course purchase and payment integration
- Course progress tracking
- Admin dashboard for managing courses and lectures
- Dark mode support

## Tech Stack

**Frontend:**
- React
- Redux Toolkit
- Tailwind CSS
- Vite
- React Router
- Radix UI
- Lucide Icons

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose
- Cloudinary (for media uploads)
- Razorpay (for payment integration)
- Zod (for schema validation)

## Installation

### Prerequisites

- Node.js
- MongoDB

### Backend

1. Clone the repository:
    ```sh
    git clone https://github.com/lokeshjatoth/E-Learning.git
    cd E-Learning/backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the [backend](http://_vscodecontentref_/0) directory and add the following environment variables:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    CLOUD_NAME=your_cloudinary_cloud_name
    API_KEY=your_cloudinary_api_key
    API_SECRET=your_cloudinary_api_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_SECRET_KEY=your_razorpay_secret_key
    ORIGIN_URL=http://localhost:5173
    ```

4. Start the backend server:
    ```sh
    npm run dev
    ```

### Frontend

1. Navigate to the [frontend](http://_vscodecontentref_/1) directory:
    ```sh
    cd ../frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the [frontend](http://_vscodecontentref_/2) directory and add the following environment variables:
    ```env
    VITE_BASE_URL=http://localhost:3000
    ```

4. Start the frontend development server:
    ```sh
    npm run dev
    ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Register a new user or log in with an existing account.
3. Create, purchase, and enroll in courses.

