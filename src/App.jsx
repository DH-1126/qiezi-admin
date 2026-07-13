import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import KYC from './pages/KYC';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import SellerProducts from './pages/SellerProducts';
import PublishWizard from './pages/PublishWizard';
import Announcements from './pages/Announcements';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter basename="/qiezi-admin">
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/seller" element={<ProtectedRoute><SellerProducts /></ProtectedRoute>} />
            <Route path="/publish" element={<ProtectedRoute><PublishWizard /></ProtectedRoute>} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
