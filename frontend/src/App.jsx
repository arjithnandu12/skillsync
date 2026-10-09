import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import JobsList from "./components/JobsList";
import JobForm from "./components/JobForm";
import JobDetails from "./components/jobDetails";
import Profile from "./components/Profile";
import Simulator from "./components/Simulator";
import Auth from "./components/LoginForm";
import Header from "./components/Header";
import ProtectedRoute from "./components/protectedRoute";

import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Home Landing Page */}
              <Route path="/" element={<JobsList />} />
              <Route path="/home" element={<Home />} />
              
              {/* Job Explorer & Detailed Compatibility Checker */}
              <Route path="/jobs" element={<JobsList />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              
              {/* Profile & Skills Management Section (stored in MongoDB) */}
              <Route path="/profile" element={<Profile />} />

              {/* Match Simulator / Sandbox */}
              <Route path="/simulator" element={<Simulator />} />

              {/* Auth */}
              <Route path="/auth" element={<Auth />} />

              {/* Protected Management Routes */}
              <Route
                path="/jobs/new"
                element={
                  <ProtectedRoute>
                    <JobForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/edit/:id"
                element={
                  <ProtectedRoute>
                    <JobForm />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
