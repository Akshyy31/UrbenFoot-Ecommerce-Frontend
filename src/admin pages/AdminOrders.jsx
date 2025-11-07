import React, { useEffect, useState } from "react";
import { Trash2, Eye, Edit, X, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { adminOrderListApi } from "../services/adminProductServices";
import { updateOrderStatusApi } from "../services/adminOrderServices";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  console.log("orders : ", orders);

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

  const handleViewOrder = (orders) => {
    setSelectedOrder(orders);
    setViewModalOpen(true);
  };

  const handleUpdateOrder = (orders) => {
    setSelectedOrder(orders);
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
    switch(status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "processing": return <Package className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getOrderTimeline = (status) => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(status);
    return statuses.map((s, idx) => ({
      status: s,
      completed: idx <= currentIndex,
      current: idx === currentIndex
    }));
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
            {orders.map((order) => (
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
                <td className="p-3 border">{order.shipping_address.address}</td>
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

      {/* View Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-2 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Order Details - #{selectedOrder.order_id}</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedOrder.user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.shipping_address.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedOrder.shipping_address.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Shipping Address</h4>
                <p className="text-gray-700">
                  {selectedOrder.shipping_address.address}<br />
                  {selectedOrder.shipping_address.city} <br />
                  LandmArk  : {selectedOrder.shipping_address.landmark}, {selectedOrder.shipping_address.state}   pin: {selectedOrder.shipping_address.pincode}<br />
                  Phone  : {selectedOrder.shipping_address.phone}
                </p>
              </div>

              {/* Product List */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Products</h4>
                <div className="space-y-2">
                  {selectedOrder.products.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border">
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center bg-blue-50 p-3 rounded font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg">${selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">{selectedOrder.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-4">Order Timeline</h4>
                <div className="flex items-center justify-between">
                  {getOrderTimeline(selectedOrder.status).map((item, idx) => (
                    <React.Fragment key={item.status}>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {getStatusIcon(item.status)}
                        </div>
                        <p className={`text-xs mt-2 capitalize ${item.current ? "font-semibold" : ""}`}>
                          {item.status}
                        </p>
                      </div>
                      {idx < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            item.completed ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updateModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Update Order Status</h3>
              <button
                onClick={() => setUpdateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-3">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="font-semibold text-lg">#{selectedOrder.order_id}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    selectedOrder.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedOrder.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : selectedOrder.status === "shipped"
                      ? "bg-purple-100 text-purple-800"
                      : selectedOrder.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Update to:</p>
                <div className="space-y-2">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={selectedOrder.status === status}
                      className={`w-full px-4 py-3 mt-2 rounded-lg text-left flex items-center gap-3 transition ${
                        selectedOrder.status === status
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed "
                          : status === "pending"
                          ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : status === "processing"
                          ? "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200"
                          : status === "shipped"
                          ? "bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200"
                          : status === "delivered"
                          ? "bg-green-50 hover:bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-50 hover:bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span className="font-medium capitalize">{status}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;