# SkillSync – Skill Compatibility Checker

SkillSync is a web application that helps users understand how well their skills align with job requirements. It analyzes existing skills, identifies skill gaps, calculates compatibility, and provides suggestions to help users improve their career readiness.

The platform aims to help students, job seekers, and professionals make informed career decisions and focus on developing the skills employers are looking for.

## ✨ Features

* **User Authentication** – Register and log in to access the application.
* **Job Exploration** – Browse available job opportunities and review their requirements.
* **Skill Compatibility Analysis** – Evaluate how well a user's skills match a particular job.
* **Skill Gap Identification** – Identify missing or underdeveloped skills required for a role.
* **Personalized Skill Suggestions** – Receive recommendations for skills to improve job compatibility.
* **Job Management** – Create and manage job listings through the application.
* **User Profile** – Manage profile information and skills.
* **Compatibility Simulator** – Explore how adding or improving skills can affect job compatibility.

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST API

### Core Logic

* Skill compatibility engine
* Skill gap analysis
* Personalized skill recommendation logic

## 📁 Project Structure

```text
skillsync/
├── backend/
│   ├── config/
│   │   └── dbConnection.js
│   ├── controllers/
│   │   ├── jobsController.js
│   │   └── userController.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │   ├── compatibilityEngine.js
│   │   └── skillSuggestions.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── Context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas database

### 1. Clone the Repository

```bash
git clone https://github.com/arjithnandu12/skillsync.git
cd skillsync
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Configure your MongoDB connection using the environment variables or configuration expected by `backend/config/dbConnection.js`.

For example, if your application reads a `MONGODB_URI` variable, create a `.env` file inside `backend/`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
```

Replace the placeholder with your actual MongoDB connection string. Do not commit credentials or secrets to GitHub.

### 3. Seed the Database

To populate MongoDB with sample candidates and job listings, run:

```bash
npm run seed
```

The seed script is intended to add sample data for testing the application's compatibility features.

### 4. Start the Backend Server

```bash
npm start
```

The backend API should be available at:

```text
http://localhost:5001
```

### 5. Configure and Start the Frontend

Open a new terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🔍 How It Works

1. **Create an account:** Register or log in to access SkillSync.
2. **Explore jobs:** Browse job opportunities and review their required skills.
3. **Evaluate compatibility:** Compare your skills with a job's requirements.
4. **Identify skill gaps:** Discover the skills you may need to develop.
5. **Get recommendations:** Use personalized skill suggestions to plan your learning.
6. **Simulate improvements:** Explore how adding skills can improve your compatibility with a target role.

## 🎯 Project Goals

SkillSync is designed to make career planning more practical by connecting a user's current abilities with real job requirements. Instead of simply displaying job listings, it helps users understand where they stand and what they can improve.

## 🚀 Future Enhancements

* AI-powered career and skill recommendations
* Learning resource suggestions for missing skills
* More detailed compatibility reports
* Job-specific learning roadmaps
* Expanded job and skill datasets
* Improved career-readiness analytics

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a pull request.

## 📄 License

No license has been specified yet. Add a license file if you intend to distribute or reuse this project under particular terms.

---

**SkillSync — Understand your skills. Discover your gaps. Build your career.**
