import { useContext, useEffect, useState } from "react";
import AuthContext from "../contextapi/AuthContext";
import Navbar1 from "../Navbar/Navbar1";
import { orderListViewApi } from "../services/orderServices";
// import { Api } from "../commonapi/api";

const Order = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  console.log(orders);

  useEffect(() => {
    if (currentUser?.id) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      const res = await orderListViewApi();
      setOrders(res || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  return (
    <>
      <Navbar1 />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-2">
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center mt-20 text-lg">
            You have no past orders.
          </p>
        ) : (
          <div className="grid gap-6 p-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl shadow-sm p-5 bg-white transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order ID #_{order.razorpay_order_id}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {order.created_at}
                  </span>
                </div>

                {/* Order Status */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">
                    Order Status: {order.status}
                  </span>
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>

                {/* Ordered Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm text-gray-700"
                    >
                      <span>
                        <span className="font-medium">{item.product.name}</span> ×{" "}
                        {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="border-t pt-4 flex justify-between text-base font-semibold mt-4">
                    <span>Total</span>
                    <span className="text-red-600">₹{order.total_amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
