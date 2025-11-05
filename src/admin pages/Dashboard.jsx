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
import { adminOrderListApi, adminProductListApi } from "../services/adminProductServices";
// import { Api } from "../commonapi/api";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [barData, setBarData] = useState([]);
  const [totalrevenue,setTotalRevenue]=useState(0)
  const [totalOrders,setTotalOrders]=useState(0)

  
  console.log("orders : ",orders);
  
  useEffect(() => {
    const fetchData = async () => {
      const resUsers = await adminUserListApi();
      const resProducts = await adminProductListApi();
      const allOrders = await adminOrderListApi()
      setUsers(resUsers.data);
      setProducts(resProducts.products);
      setOrders(allOrders.orders);
      setTotalRevenue(allOrders.total_revenue_generated)
      setTotalOrders(allOrders.total_products_purchased)
      setBarData(computeWeeklyRevenue(allOrders.orders));
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // every 30 seconds
    return () => clearInterval(interval); // clean up
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

  console.log(totalPending);
  

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
      value: `₹${totalrevenue}`,
      icon: <Wallet className="w-5 h-5" />,
      // bg: "bg-rose-200",
      bg: "bg-yellow-200",
    },
  ];

  const pieData = [
    { name: "Pending", value: totalPending },
    { name: "Delivered", value: totalDelivered },
    { name: "Processing", value: totalProcessing },
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const computeWeeklyRevenue = (orders) => {
    
    const revenueMap = { Sun: 0, Mon: 0, Tue: 0, Wed: 0,Thu: 0, Fri: 0, Sat: 0,};

    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      const day = daysOfWeek[orderDate.getDay()];
      revenueMap[day] += order.total || 0;
    });

    // Return as an array in order
    return daysOfWeek.map((day) => ({
      day,
      revenue: revenueMap[day],
    }));
  };

  const COLORS = ["#9578cd", "#4f46e5", "#10b981"];

  return (
    <div className="bg-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-10 p-3 ">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
        <div className="bg-white  p-2 rounded-xl shadow">
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

          
          <div className="flex justify-around mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#9578cd]"></span>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#342ea1]"></span>
              <span>Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2f745d]"></span>
              <span>Processing</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-3 rounded-xl shadow ">
          <h5 className="text-lg font-semibold mb-4">Weekly Revenue</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="day" />
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
