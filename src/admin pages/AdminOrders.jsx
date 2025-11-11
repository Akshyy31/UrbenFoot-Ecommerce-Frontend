import React, { useEffect, useState } from "react";
import {
  Trash2,
  Eye,
  Edit,
  X,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { adminOrderListApi } from "../services/adminProductServices";
import { updateOrderStatusApi } from "../services/adminOrderServices";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setUpdateModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatusApi(selectedOrder.order_id, newStatus.toUpperCase());
      // Update the local UI instantly
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === selectedOrder.order_id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setUpdateModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getOrderTimeline = (status) => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(status);
    return statuses.map((s, idx) => ({
      status: s,
      completed: idx <= currentIndex,
      current: idx === currentIndex,
    }));
  };

  // ✅ Filtered orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === "" ||
      order.user.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

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
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm border-2 border-gray-200 rounded-lg overflow-hidden">
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
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="p-3 text-blue-500 font-semibold border">
                  order_{order.order_id}
                </td>
                <td className="p-3">
                  <div>
                    <div className="font-semibold">{order.user}</div>
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
                <td className="p-3 border">
                  {order.shipping_address.address}
                </td>
                <td className="p-3 border">
                  {new Date(order.date).toLocaleString()}
                </td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status.toLowerCase() === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status.toLowerCase() === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status.toLowerCase() === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleUpdateOrder(order)}
                      className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Existing modals (unchanged) */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          {/* ...view modal content here... */}
        </div>
      )}

      {updateModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          {/* ...update modal content here... */}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
