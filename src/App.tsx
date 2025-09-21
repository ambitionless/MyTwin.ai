import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Routes/ProtectedRoute';

// Lazy Imports
const LandingPage = lazy(() => import('./components/Landing/LandingPage'));
const SignupPage = lazy(() => import('./components/Auth/SignupPage'));
const LoginPage = lazy(() => import('./components/Auth/LoginPage'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/dashboard" 
                element={
            
                    <Dashboard />

                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
