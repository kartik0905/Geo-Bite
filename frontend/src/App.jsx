import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CafeDetail from './pages/CafeDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
          <Navbar />
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cafes/:id" element={<CafeDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
