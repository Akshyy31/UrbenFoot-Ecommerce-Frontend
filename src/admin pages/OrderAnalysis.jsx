import {
  BarChart,
  CheckCircle,
  DollarSign,
  LineChart,
  Package,
  ShoppingCart,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  Legend,
  Bar,
} from "recharts";

function OrderAnalysis() {
  const [dashboardData, setDashboardData] = useState({
    topProducts: [],
    orderStats: {},
    monthlySales: [],
  });
  
  useEffect(() => {
    // Mock data - Replace with actual API call
    setDashboardData({
      topProducts: [
        {
          id: 1,
          name: "Wireless Headphones",
          orders: 342,
          revenue: 34200,
          image: "🎧",
        },
        {
          id: 2,
          name: "Smart Watch Series 5",
          orders: 298,
          revenue: 59600,
          image: "⌚",
        },
        {
          id: 3,
          name: "Laptop Pro 15",
          orders: 187,
          revenue: 186813,
          image: "💻",
        },
        {
          id: 4,
          name: "Bluetooth Speaker",
          orders: 165,
          revenue: 8250,
          image: "🔊",
        },
        {
          id: 5,
          name: "Phone Case Premium",
          orders: 143,
          revenue: 2860,
          image: "📱",
        },
      ],
      orderStats: {
        totalOrders: 1245,
        delivered: 892,
        cancelled: 67,
        pending: 286,
        totalRevenue: 456780,
      },
      monthlySales: [
        { day: "Week 1", sales: 12450, orders: 145 },
        { day: "Week 2", sales: 18320, orders: 198 },
        { day: "Week 3", sales: 15670, orders: 176 },
        { day: "Week 4", sales: 21340, orders: 234 },
      ],
    });
  }, []);

  const { topProducts, orderStats, monthlySales } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard Analytics
          </h1>
          <p className="text-gray-600">
            Overview of your store performance this month
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {orderStats.totalOrders}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {orderStats.delivered}
                </p>
                <p className="text-green-600 text-xs mt-1">
                  {(
                    (orderStats.delivered / orderStats.totalOrders) *
                    100
                  ).toFixed(1)}
                  % success rate
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Cancelled</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {orderStats.cancelled}
                </p>
                <p className="text-red-600 text-xs mt-1">
                  {(
                    (orderStats.cancelled / orderStats.totalOrders) *
                    100
                  ).toFixed(1)}
                  % cancelled
                </p>
              </div>
              <div className="bg-red-100 p-4 rounded-full">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  ${orderStats.totalRevenue?.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Monthly Sales Overview
              </h2>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => {
                    if (name === "sales")
                      return [`$${value.toLocaleString()}`, "Sales"];
                    return [value, "Orders"];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Weekly Orders</h2>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Top 5 Products</h2>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              This Month
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                    Rank
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                    Product
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                    Total Orders
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                    Revenue
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-orange-600"
                            : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{product.image}</span>
                        <span className="font-semibold text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-700">
                        {product.orders}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">orders</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-green-600 text-lg">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">
                Delivered Orders
              </h3>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-700">
              {orderStats.delivered}
            </p>
            <div className="mt-4 bg-green-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-600 h-full transition-all duration-500"
                style={{
                  width: `${
                    (orderStats.delivered / orderStats.totalOrders) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-800">
                Pending Orders
              </h3>
              <Package className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-4xl font-bold text-yellow-700">
              {orderStats.pending}
            </p>
            <div className="mt-4 bg-yellow-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-yellow-600 h-full transition-all duration-500"
                style={{
                  width: `${
                    (orderStats.pending / orderStats.totalOrders) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 border border-red-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-800">
                Cancelled Orders
              </h3>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-700">
              {orderStats.cancelled}
            </p>
            <div className="mt-4 bg-red-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-500"
                style={{
                  width: `${
                    (orderStats.cancelled / orderStats.totalOrders) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderAnalysis;
