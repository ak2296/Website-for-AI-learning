# Website for the company
This app uses TypeScript + Vite + React

Website for AI Learning
This is a website built with React and TypeScript for the frontend, and an Express.js backend with Sequelize and SQLite, it offers a modern, responsive interface with administrative capabilities. The DB is temporary and can be changed to the desired service.

Features

Resource Directory: Access a collection of learning materials (e.g., PDFs, videos) uploaded by admins.
Admin Dashboard: Manage files (partially implemented).
Responsive Design: Works on desktop and mobile devices.

Getting Started
Prerequisites

Node.js (v16 or later)
npm or yarn
Git (for cloning the repository)

Installation

Clone the Repository
git clone https://github.com/ak2296/Website-for-AI-learning.git
cd Website-for-AI-learning


Install Frontend Dependencies

Navigate to the root directory:cd Website-for-AI-learning


Install dependencies:npm install




Install Backend Dependencies

Navigate to the backend directory:cd backend
npm install




Set Up Environment Variables

In .env file in the backend directory: adjust as needed (There are comments to help)




Running the Application

Start the Backend Server

From the backend directory:npx ts-node app.ts


The server should start on http://localhost:5000. Check the console for confirmation.


Start the Frontend Development Server

Open a new terminal. From the root directory:npm run dev


Open your browser and go to http://localhost:5173. The app should load with the home page.



Usage

Creating an Admin User

To create an admin account, run this from the backend directory:
npx ts-node src/scripts/createAdmin.ts
this way you create the admin in console. this is not implemented directly to the website to prevent others to be able to create accounts.

Prerequisites: Ensure the backend is running and the admin dashboard is accessible.
Steps:
To access the admin dashboard just add /admin to the address bar. there is no button to access it for security reasons. 
you'll end up in a log in page. Log in and you'll be redirected to admin dashboard.



Uploading Files

Prerequisites: Ensure the backend is running.
Steps:
Access the admin dashboard and navigate to the desired management section. The home and About page has default images and text. the resources is the main section to upload and delete files and lessons.


