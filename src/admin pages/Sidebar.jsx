import React, { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  ShoppingCart,
  ChevronRight,
  Package,
  X,
} from "lucide-react";
import AuthContext from "../contextapi/AuthContext";

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  let { currentUser,logoutUser } = useContext(AuthContext);
  console.log("user from side bar as admin", currentUser);

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    { label: "Manage Users", icon: <User size={20} />, path: "/admin/users" },
    {
      label: "Manage Products",
      icon: <ShoppingCart size={20} />,
      path: "/admin/products",
    },
    { label: "Orders", icon: <Package size={20} />, path: "/admin/orders" },
  ];

  

  return (
    <div className="h-full w-72 bg-white flex flex-col shadow-2xl z-10 border-r border-gray-200 relative overflow-y-auto scrollbar-thin">
      {/* Close Button (Mobile Only) */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-black md:hidden"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      {/* Header */}
      <div className="flex justify-center items-center h-20">
        <h3 className="font-extrabold text-black text-3xl text-center tracking-wider uppercase">
          Urban-Foot
        </h3>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={`group flex items-center justify-between px-4 py-3 !text-black !no-underline rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-violet-400 to-blue-200 text-white shadow transform translate-x-1"
                  : "hover:bg-slate-700/50 text-slate-800 hover:text-white hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight
                size={16}
                className={`transition-transform duration-200 ${
                  location.pathname === item.path
                    ? "rotate-90 text-white"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
              />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition duration-200 mb-2">
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>

        <button
          onClick={logoutUser}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <LogOut size={18} />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
