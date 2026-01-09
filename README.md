Supplier Database Management System
Simple MERN-lite style project using:

Frontend: Vanilla HTML/CSS/JS (dashboard with search, filter, categories, pagination)
Backend: Node.js + Express
Database: MongoDB (mongoose)
What is included
backend/ — server code with routes, controllers, and Supplier model
frontend/ — static dashboard UI (index.html, styles.css, app.js)
.gitignore, README and package.json
Setup (local)
Install Node.js (v16+ recommended) and MongoDB.
Start MongoDB (e.g. mongod).
In backend/ directory:
npm install
set MONGO_URI env var if needed (default mongodb://127.0.0.1:27017/supplierDB)
npm run dev (requires nodemon) or npm start
Serve frontend: open frontend/index.html in a browser, or serve it from a static server.
For CORS ease in development, run frontend on localhost while backend runs on port 5000.
API Endpoints
POST /supplier/add — add supplier (body: name,company,phone,address,category)
GET  /supplier/all — list suppliers with query params:
q search term, category, page, limit
GET  /supplier/:id — get single supplier
PUT  /supplier/update/:id — update supplier
DELETE /supplier/delete/:id — delete supplier
Future improvements
Add authentication (JWT)
File upload for supplier documents
More robust validation (Joi)
Tests and CI
