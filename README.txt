# AthleticHub - Server 🚀

This is the official backend server for the AthleticHub project. Built with Express.js, this server provides a robust RESTful API for the AthleticHub frontend, handling all data management for user authentication, event management, and bookings.

**Live API Base URL:** [https://assignment-11-server-three-sage.vercel.app](https://assignment-11-server-three-sage.vercel.app)
Frontend repo link : https://github.com/Salim-Shadman/AthleticHub-Frontend.git
---

## ✨ Key Features

* **RESTful API:** Provides clean and structured API endpoints for all application data (events, bookings).
* **JWT Authentication:** Secures private routes and manages user sessions using JSON Web Tokens (JWT) delivered via `httpOnly` cookies, enhancing security against XSS attacks.
* **Data Management:** Connects to a MongoDB database to securely store and manage all user, event, and booking data.
* **Secure & Scoped Operations:** Ensures that users can only view, modify, or delete data that they own.
* **CORS Handling:** Properly configured CORS policies to allow secure cross-origin communication with the frontend application.

---

## 🛠️ Tech Stack

* **Node.js:** Server-side JavaScript runtime environment.
* **Express.js:** A robust framework for building web applications.
* **MongoDB:** NoSQL database for data storage.
* **JSON Web Token (`jsonwebtoken`):** Used to create and verify tokens for user authentication.
* **Cookie-Parser:** For parsing HTTP cookies on the server-side.
* **CORS:** To manage Cross-Origin Resource Sharing.
* **Dotenv:** For loading environment variables.

---

## 🔗 API Endpoints

| Method | Endpoint             | Description                                  | Security      |
| :----- | :------------------- | :------------------------------------------- | :------------ |
| **POST** | `/api/auth/jwt`      | Generates a JWT when a user logs in.         | Public        |
| **POST** | `/api/auth/logout`   | Clears the user's session cookie.            | Public        |
| **GET** | `/api/events`        | Retrieves all events with pagination.        | Public        |
| **GET** | `/api/events/:id`    | Retrieves a single event by its ID.          | Public        |
| **POST** | `/api/events`        | Creates a new event.                         | **Protected** |
| **PUT** | `/api/events/:id`    | Updates a specific event.                    | **Protected** |
| **DELETE**| `/api/events/:id`    | Deletes a specific event.                    | **Protected** |
| **GET** | `/api/bookings`      | Retrieves all bookings for a specific user.  | **Protected** |
| **POST** | `/api/bookings`      | Creates a new booking.                       | **Protected** |
| **DELETE**| `/api/bookings/:id`  | Cancels a specific booking.                  | **Protected** |

* **Protected** routes require a valid JWT cookie to be accessed.

---

## 🚀 Getting Started

To run this server on your local machine, follow these steps.

### Prerequisites

* [Node.js](https://nodejs.org/en) (Version 18 or higher)
* [Git](https://git-scm.com/)

### Installation & Setup

```bash
# 1. Clone this repository
git clone <YOUR_REPOSITORY_LINK>

# 2. Navigate to the project directory
cd <PROJECT_FOLDER_NAME>

# 3. Install npm packages
npm install

# .env.local

# Your MongoDB Atlas connection string
DB_URI="mongodb+srv://<username>:<password>@cluster_url/..."

# A strong and random JWT secret key
JWT_ACCESS_SECRET="YOUR_VERY_LONG_AND_SECRET_RANDOM_STRING"

# The port the server will run on (optional, defaults to 3000)
PORT=3000

# To run the server in development mode (with nodemon)
npm run dev

# To run the server in production mode
npm run start