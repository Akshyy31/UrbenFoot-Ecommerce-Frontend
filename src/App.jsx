import {} from "lucide-react";
import "./App.css";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./products/ProductList";
import ProductDetail from "./products/ProductDetail";
import Cart from "./Cart/Cart";
import Checkout from "./components/Checkout";
import Order from "./components/Order";
import Wishlist from "./Wishlist page/Wishlist";
import ProtectedRoute from "./Routes/ProtectedRoute";
import AdminLayout from "./admin pages/AdminLayout";
import Dashboard from "./admin pages/Dashboard";
import AdminProducts from "./admin pages/AdminProducts";
import AdminOrders from "./admin pages/AdminOrders";
import Users from "./admin pages/Users";
import Userdetails from "./admin pages/Userdetails";
import EditProduct from "./admin pages/EditProducts";
import UserProfile from "./components/UserProfile";
import ContactPage from "./components/ContactPage";
import AdminContactDashboard from "./admin pages/AdminContactDashboard";


function App() {

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* User Protected Routes */}
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/cartpage" element={<Cart />} />
        <Route path="/check-out" element={<Checkout />} />
        <Route path="/order-confirmation" element={<Order />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="messages" element={<AdminContactDashboard />} />
          <Route path="users/:id" element={<Userdetails />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
