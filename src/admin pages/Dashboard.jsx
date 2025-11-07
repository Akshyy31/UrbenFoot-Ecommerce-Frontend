import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  Truck,
  Clock,
  Wallet,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminUserListApi } from "../services/adminUserServices";
import {
  adminOrderListApi,
  adminProductListApi,
} from "../services/adminProductServices";
import { OrderSummaryViewApi } from "../services/adminOrderServices";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const resUsers = await adminUserListApi();
      const resProducts = await adminProductListApi();
      const allOrders = await adminOrderListApi();
      const summary = await OrderSummaryViewApi();

      setUsers(resUsers.data);
      setProducts(resProducts.products);
      setOrders(allOrders.orders);
      setTotalRevenue(summary.monthly_sales || 0);
      setTotalOrders(summary.summary.delivered + summary.summary.cancelled);

      // Generate 12 months data
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlyData = months.map((month, index) => ({
        month,
        revenue:
          index === new Date().getMonth() ? summary.monthly_sales || 0 : 0,
      }));

      setMonthlyRevenue(monthlyData);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalDelivered = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;
  const totalProcessing = orders.filter(
    (order) => order.status === "PROCESSING"
  ).length;
  const totalPending = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const stats = [
    {
      label: "Users",
      value: users.length,
      icon: <Users className="w-5 h-5" />,
      bg: "bg-blue-200",
    },
    {
      label: "Products",
      value: products.length,
      icon: <Package className="w-5 h-5" />,
      bg: "bg-pink-200",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart className="w-5 h-5" />,
      bg: "bg-green-200",
    },
    {
      label: "Pending",
      value: totalPending,
      icon: <Truck className="w-5 h-5" />,
      bg: "bg-green-300",
    },
    {
      label: "Delivered",
      value: totalDelivered,
      icon: <Truck className="w-5 h-5" />,
      bg: "bg-blue-300",
    },
    {
      label: "Processing",
      value: totalProcessing,
      icon: <Clock className="w-5 h-5" />,
      bg: "bg-yellow-200",
    },
    {
      label: "Revenue",
      value: `₹${totalRevenue}`,
      icon: <Wallet className="w-5 h-5" />,
      bg: "bg-yellow-200",
    },
  ];

  const pieData = [
    { name: "Pending", value: totalPending },
    { name: "Delivered", value: totalDelivered },
    { name: "Processing", value: totalProcessing },
  ];

  const COLORS = ["#9578cd", "#4f46e5", "#10b981"];

  return (
    <div className="bg-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-10 p-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl p-4 flex flex-col gap-2 shadow-md ${stat.bg}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                {stat.icon}
                <span className="font-medium">{stat.label}</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
        {/* Pie Chart */}
        <div className="bg-white p-2 rounded-xl shadow">
          <h5 className="text-lg font-semibold mb-4">
            Order Status Distribution
          </h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white p-3 rounded-xl shadow">
          <h5 className="text-lg font-semibold mb-4">Monthly Revenue</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month"/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
