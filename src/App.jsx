import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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

function HomeProductModalPage() {
  return <><Home /><ProductDetail /></>;
}

function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<HomeProductModalPage />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/seller" element={<SellerProducts />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/publish" element={<PublishWizard />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/qiezi-admin">
      <AuthProvider><AppRoutes /></AuthProvider>
    </BrowserRouter>
  );
}
