# LearnSphere LMS Frontend

This frontend is designed to work with the existing Node/Express backend on:

http://localhost:5000

Implemented flow:
Home -> Register/Login -> Course Catalog -> Course Details -> YouTube Lessons -> Quiz -> Pass -> Certificate

Backend endpoints used:
POST /api/auth/register
POST /api/auth/login
GET /api/courses
GET /api/courses/:id
GET /api/quiz/course/:courseId

Important:
1. Start the backend with `node server.js`.
2. Open `index.html` using a local static server. VS Code Live Server is recommended.
3. The frontend stores the JWT token returned by login in localStorage.
4. Certificates are printable from the browser and can be saved as PDF.
