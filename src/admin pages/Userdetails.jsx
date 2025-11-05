import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Common API/api";
import {
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  Shield,
  ShoppingCart,
  User,
} from "lucide-react";

// Status config for orders
const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <Clock className="w-3 h-3" />,
  },
  processing: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <RefreshCcw className="w-3 h-3 animate-spin" />,
  },
  delivered: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle className="w-3 h-3" />,
  },
};

function Userdetails() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await Api.get(`/users/${id}`);
      const user = res.data;

      setUserDetails(user);
      setWishlistItems(user.wishlist || []);
      setCartItems(user.cart || []);
      setUserOrders(user.orders || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getTotalCartValue = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-white p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-blue-50 rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4 p-2">
            <div className="w-16 h-16 bg-gradient-to-r p-2 from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{userDetails.username}</h2>
              <p className="flex items-center text-gray-600 text-sm gap-2 mt-1">
                <Mail className="w-4 h-4" /> {userDetails.email}
              </p>
            </div>
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                userDetails.isBlocked
                  ? "text-red-700 bg-red-100 border border-red-200"
                  : "text-green-700 bg-green-100 border border-green-200"
              }`}
            >
              <Shield className="w-4 h-4" />
              {userDetails.isBlocked ? "Blocked" : "Active"}
            </span>
          </div>
        </div>



        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 p-3 gap-6">
          <UserListBox title="Wishlist" icon={<Heart className="text-pink-600" />} items={wishlistItems} type="wishlist" />
          <UserListBox
            title="Cart"
            icon={<ShoppingCart className="text-blue-600" />}
            items={cartItems}
            type="cart"
            footer={
              cartItems.length > 0 && (
                <div className="pt-3 mt-3 border-t flex justify-between text-sm font-semibold p-3">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{getTotalCartValue()}</span>
                </div>
              )
            }
          />
          <div className=" rounded-2xl shadow-sm p-4">
            <SectionHeader icon={<Package className="text-green-600" />} title="Recent Orders" count={userOrders.length} color="green" />
            {userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="border bg-blue-50 rounded-lg m-3 p-2 hover:shadow transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">#{order.id}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {order.date}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[order.status]?.color}`}
                      >
                        {statusConfig[order.status]?.icon}
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <img src={item.image} alt={item.name} className="w-6 h-6 object-cover rounded" />
                          <span className="flex-1 truncate">{item.name}</span>
                          <span className="text-gray-600">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span>Total:</span>
                      <span className="font-bold text-green-600">₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<Package className="text-gray-300" />} text="No orders yet" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Card for user contact details
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
    <div className="w-6 h-6">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold text-sm truncate">{value || "—"}</p>
    </div>
  </div>
);

// Reusable section header
const SectionHeader = ({ icon, title, count, color }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <span className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded-full`}>{count}</span>
  </div>
);

// List box for cart or wishlist
const UserListBox = ({ title, icon, items, type, footer }) => {
  const iconColor = type === "wishlist" ? "pink" : "blue";
  const emptyIcon = type === "wishlist" ? <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" /> : <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />;
  const emptyText = type === "wishlist" ? "No items in wishlist" : "Cart is empty";

 
};

// Empty state reusable block
const EmptyState = ({ icon, text }) => (
  <div className="text-center py-8">
    {icon}
    <p className="text-gray-500">{text}</p>
  </div>
);

export default Userdetails;
