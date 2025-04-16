# Huddle Backend

This is the backend API for the **Huddle** project — a platform dedicated to empowering women in football through resources, events, podcasts, and a predictive gaming experience.

## 🛠️ Technologies Used

- **Node.js** with **Express**: Web server and REST API framework.
- **MongoDB** with **Mongoose**: Database and ODM for handling user, event, article, podcast, and token models.
- **Cloudinary**: For uploading and managing image/audio files.
- **dotenv**: For managing environment variables.
- **Multer**: For handling multipart/form-data (file uploads).
- **CORS**: To allow frontend-backend communication.
- **Morgan**: For HTTP request logging.

## 🚀 Setup Instructions

1. **Clone the repository** and navigate to the backend folder:
   ```bash
   git clone https://github.com/your-repo/huddle-api.git
   cd huddle-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** and set:
   ```
   DATABASE_URL=your_mongodb_uri
   CLOUDINARY_SECRET=your_cloudinary_secret
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

## 🧠 API Overview

The backend provides RESTful endpoints for:

- `/users` – User registration, login, logout
- `/events` – Events listings and details
- `/articles` – News and blog posts
- `/podcasts` – Upload and fetch podcast content
- `/opportunities` – Coaching and job opportunities

## ☁️ Media Handling

Media files (e.g., images, audio) are uploaded using Multer and then transferred to **Cloudinary** for optimized delivery.

## 🔒 Authentication

Basic token-based auth using JWT and localStorage on the frontend. Protected routes check for a valid token before allowing access.

## 📄 License

This project is part of an educational initiative and may be reused under appropriate attribution.
