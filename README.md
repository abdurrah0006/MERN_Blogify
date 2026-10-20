# Blogify — MERN Blogging App

A full-stack blogging application with a **React and Vite frontend** and an **Express, MongoDB, and Node.js backend**. The app supports account registration and sign-in, publishing and editing posts, browsing and searching posts, profiles, and comments.

## Features

- Register and sign in with token-based authentication
- Browse posts, search, and navigate paginated results
- Create and edit posts with image upload support
- View individual posts and author profiles
- Add and manage comments
- Protected routes for signed-in actions
- Cloudinary integration for uploaded media

## Tech stack

- React, React Router, Vite, Axios, and Swiper
- Node.js and Express
- MongoDB with Mongoose
- JWT authentication
- Cloudinary image storage

## Run locally

The app has separate frontend and backend folders. Start each in its own terminal.

```bash
cd BlogApp/backend
npm install
npm run dev
```

Create `BlogApp/backend/.env` with the environment variables below, then in another terminal:

```bash
cd BlogApp/frontend
npm install
npm run dev
```

Open the Vite URL printed in the frontend terminal.

## Backend environment

Configure these values in `BlogApp/backend/.env`:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-random-secret>
CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUD_API_KEY=<your-cloudinary-api-key>
CLOUD_API_SECRET=<your-cloudinary-api-secret>
```

Use your own credentials and keep `.env` files out of version control.

## Project structure

- `BlogApp/frontend/` — React pages, components, and styles
- `BlogApp/backend/` — API server, routes, controllers, models, and upload configuration
