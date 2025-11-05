import React, { useEffect, useState } from "react";
// import { Api } from "../commonapi/api";
import { Trash2 } from "lucide-react";
import { adminOrderListApi } from "../services/adminProductServices";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  console.log("orders : ",orders);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await adminOrderListApi();
        setOrders(res.orders);
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (userId, orderId, newStatus) => {
    try {
      const res = await Api.get(`/users/${userId}`);
      const updatedOrders = res.data.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      await Api.patch(`/users/${userId}`, { orders: updatedOrders });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  
  return (
    <div className="p-4 bg-white min-h-screen">
      <h4 className="text-2xl text-center font-semibold mb-4">All Orders</h4>

      <div className="flex flex-col sm:flex-row sm:items-center mb-3 gap-2 w-full sm:w-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search by User Name"
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 w-full sm:w-64 transition"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition w-full sm:w-48"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm  border-2 border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-left text-gray-600">
            <tr>
              <th className="p-3 border-1">Order ID</th>
              <th className="p-3 border-1">User</th>
              <th className="p-3 border-1">Items</th>
              <th className="p-3 border-1">Address</th>
              <th className="p-3 border-1">Time</th>
              <th className="p-3 border-1">Status</th>
              <th className="p-3 border-1">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y  divide-gray-100">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="p-3 text-blue-500 font-semibold  border">
                  order_{order.order_id}
                </td>
                <td className="p-3">
                  <div>
                    <div className="font-semibold">{order.username}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </div>
                </td>
                <td className="p-3 space-y-1 border">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      {item.product_name}{" "}
                      <span className="text-gray-500">×{item.quantity}</span>
                    </div>
                  ))}
                </td>
                <td className="p-3 border">{order.address}</td>
                <td className="p-3 border">
                  {new Date(order.date).toLocaleString()}
                </td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 flex  gap-1 ">
                  {order.status === "pending" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.userId, order.id, "processing")
                      }
                      className="text-xs px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Start Processing
                    </button>
                  )}
                  {order.status === "processing" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.userId, order.id, "delivered")
                      }
                      className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded border text-sm ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )} */}
    </div>
  );
}

export default AdminOrders;
