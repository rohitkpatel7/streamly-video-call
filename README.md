# Streamly – Video Call & Language Exchange App

Streamly is a full stack web application where users can connect with language partners,
send friend requests, and make real-time video calls.

This project was built as a learning project to understand authentication,
real-time communication, and full stack deployment.

## Live Project Links

Frontend: https://streamly-frontend-nu.vercel.app  
Backend API: https://streamly-backend-2nmm.onrender.com

## Features

- User signup and login
- JWT authentication using cookies
- User onboarding
- Friend request system
- Language exchange profiles
- Real-time video calling using Stream API
- Responsive UI

## Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS
- React Router
- Axios

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Stream Video API

Deployment:
- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on MongoDB Atlas

## How to Run Locally

1. Clone the repository

git clone https://github.com/rohitkpatel7/streamly-video-call.git  
cd streamly-video-call

2. Backend setup

cd backend  
npm install  

Create a .env file and add required environment variables.

npm run dev  

Backend will run on http://localhost:5001

3. Frontend setup

cd frontend  
npm install  
npm run dev  

Frontend will run on http://localhost:5173

## Notes

- Environment variables are not committed to GitHub
- Authentication is handled using HTTP-only cookies
- Stream API is used only from backend for security

## Developer

Rohit Patel  
GitHub: https://github.com/rohitkpatel7
