import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-vh-100 bg-light">
          <Navbar />
          <div className="container py-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/create" element={<CreatePostPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
