# AthleticHub - Server

This is the Express.js backend server for the AthleticHub platform. It handles API requests, user authentication with JWT, and communicates with the MongoDB database.

Live API URL: [https://carrier-code-server.vercel.app](https://carrier-code-server.vercel.app)

---

# Key Features


RESTful API: Provides endpoints for all CRUD (Create, Read, Update, Delete) operations related to events and bookings.

JWT Authentication: Secures private routes by generating and verifying JSON Web Tokens, which are stored in HTTP-only 
cookies.

Data Management: Connects with MongoDB to securely store and retrieve user, event, and booking data.

Secure Operations: Ensures that users can only modify or delete data that they own.

---

# Technologies & Packages Used

* Express.js
* MongoDB
* CORS
* JSON Web Token (JWT)
* Cookie-Parser
* Dotenv