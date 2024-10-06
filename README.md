# MacroManage

**MacroManage** is a full-stack web application designed to help users track their food intake and weight, with features like secure login, password recovery, and detailed logs. Users can monitor their daily nutrition and weight progress over time.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)

## Demo

You can try the live application here: [MacroManage](https://macromanage.netlify.app/food-log)

## Features
- **Food Database**: Database with thousands of food items sourced from the USDA database. 
- **Track food intake**: Log your meals and monitor your daily nutritional breakdown (calories, protein, carbs, fats).
- **Change nutrition goals**: Customize and set your own nutrition goals based on your dietary needs.
- **Weight tracking**: Record your weight regularly and monitor your progress over time.
- **Login and authentication**: Secure login features including email/password authentication, and password recovery.
- **Forgot password**: If a user forgets their password, they can reset it via an email link.
- **Responsive design**: Fully responsive, optimized for both desktop and mobile devices.

## Tech Stack

### Frontend:
- **React.js**: Handles the dynamic user interface and front-end logic.
- **Netlify**: Frontend is hosted on Netlify for fast, global access.
  
### Backend:
- **Node.js**: Backend for handling API requests and business logic.
- **Express.js**: Serves the API routes and handles backend processes.
- **PostgreSQL**: Database for storing user data, food logs, and weight logs.

### Authentication:
- **JWT (JSON Web Tokens)**: Used for secure user authentication.
- **Nodemailer**: Integrated with email services for "Forgot Password" functionality.

## Installation

To run the application locally, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [PostgreSQL](https://www.postgresql.org/) database running locally or remotely

### Backend Setup

1. Clone the repository:
   git clone https://github.com/your-username/macromanage.git

2. Navigate to backend folder: 
   cd macromanage/backend

3. Install backend dependencies:
   npm install

4. Create a .env in the backend folder and add your environment variables:
  PORT=5000
  DATABASE_URL=your-postgresql-connection-string
  JWT_SECRET=your-jwt-secret
  EMAIL_USER=your-email@example.com
  EMAIL_PASS=your-email-password

5. Start backend server:
   node index.js

### Frontend Setup

1. Navigate to root folder "macromanage'

2. Install frontend devepencies:
   npm install

3. Create a .env in the root folder and add your environment variables:
  REACT_APP_API_URL=http://localhost:5000

4. Start frontend:
   npm start

5. Visit http://localhost:3000 to use the application.

## Usage

### Signing Up
1. Navigate the login page on top right.
2. Click on sign up
3. Enter the required information, including your email, password, and any other necessary details.
4. Submit the form to create your account.
5. After successful registration, you will be redirected to the login page.

### Logging In
1. Navigate to the login page.
2. Enter your registered email and password.
3. Click the "Login" button to access your account.

### Logging Food
1. Sign in to the application.
2. Navigate to the "Food Log" section.
3. Add meals, specifying the food items and their respective nutritional information (calories, protein, carbs, fats).
4. Track daily intake and see how it compares to your nutrition goals.

### Tracking Weight
1. Go to the "Weight Log" section.
2. Enter your current weight for the day.
3. View weight progress over time through the visual weight tracker.

### Changing Nutrition Goals
1. Navigate to the "Nutrition Goals" section.
2. Set your desired calorie and macro goals.
3. Save changes to update your nutrition goals accordingly.

### Forgot Password
1. On the login page, click "Forgot Password."
2. Enter your email to receive a password reset link.
3. Follow the link in your email to reset your password securely. (Usually in the spam folder)
