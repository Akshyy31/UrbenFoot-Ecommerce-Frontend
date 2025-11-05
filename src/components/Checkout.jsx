import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CartListApi } from "../services/productSerives";
import { createOrderApi, verifyPaymentApi } from "../services/orderServices";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        console.log("✅ DEBUG: Razorpay already loaded");
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("✅ DEBUG: Razorpay SDK loaded");
        resolve(true);
      };
      script.onerror = () => {
        console.error("❌ DEBUG: Razorpay SDK failed to load");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // ✅ Load cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log("🟡 DEBUG: Fetching cart...");
        const res = await CartListApi();
        console.log("✅ DEBUG: Cart loaded", res);
        setCartSummary(res);
      } catch (error) {
        console.error("❌ DEBUG: Cart load failed:", error);
        toast.error("Failed to load cart.");
      }
    };
    fetchCart();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Main place order function
  const handlePlaceOrder = async () => {
    const { phone, address, city, state, pincode } = formData;

    if (!phone || !address || !city || !state || !pincode) {
      toast.warning("Please fill all required fields!");
      return;
    }

    if (!cartSummary || !cartSummary.items?.length) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Step 1: Load Razorpay SDK
      console.log("🟡 DEBUG: Loading Razorpay script...");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load.");
        setLoading(false);
        return;
      }

      // ✅ Step 2: Create order in backend
      console.log("🟡 DEBUG: Creating order with formData:", formData);
      const orderRes = await createOrderApi(formData);
      console.log("✅ DEBUG: Order created successfully:", orderRes);

      if (!orderRes || !orderRes.order_id || !orderRes.key) {
        console.error("❌ DEBUG: Order creation failed, response:", orderRes);
        toast.error("Order creation failed. Try again.");
        setLoading(false);
        return;
      }

      // ✅ Step 3: Initialize Razorpay payment
      const options = {
        key: orderRes.key,
        amount: orderRes.total_amount * 100,
        currency: orderRes.currency || "INR",
        name: "UrbanFoot",
        description: "UrbanFoot Shoe Order",
        order_id: orderRes.order_id,
        prefill: {
          contact: formData.phone,
        },
        theme: { color: "#000000" },
        handler: async function (response) {
          console.log("✅ DEBUG: Payment success:", response);
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            console.log("🟡 DEBUG: Verifying payment:", verifyData);
            const verifyRes = await verifyPaymentApi(verifyData);
            console.log("✅ DEBUG: Payment verification response:", verifyRes);
            toast.success(verifyRes.message || "Payment successful!");
            navigate("/order-confirmation");
          } catch (err) {
            console.error("❌ DEBUG: Payment verification failed:", err);
            toast.error("Payment verification failed!");
          }
        },
      };

      console.log("🟡 DEBUG: Razorpay options ready:", options);
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("❌ DEBUG: Payment failed:", response);
        toast.error("Payment failed ❌");
      });
    } catch (err) {
      console.error("❌ DEBUG: Order process error:", err);
      toast.error("Something went wrong while placing order!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE - Address Form */}
          <div>
            <h2 className="text-2xl font-bold mb-3">DELIVERY DETAILS</h2>
            <div className="space-y-6 p-3">
              {["phone", "address", "city", "landmark", "pincode"].map((field, i) => (
                <div key={i} className="p-2">
                  <input
                    type="text"
                    name={field}
                    placeholder={
                      field.charAt(0).toUpperCase() + field.slice(1) +
                      (["phone", "address", "city", "pincode"].includes(field) ? " *" : "")
                    }
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-400 px-4 py-3 focus:outline-none focus:border-black"
                  />
                </div>
              ))}

              {/* State Dropdown */}
              <div className="relative p-2">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-400 px-4 py-3 bg-white focus:outline-none focus:border-black appearance-none"
                >
                  <option value="">State *</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Delhi">Delhi</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-black text-white py-3 font-bold text-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Processing..." : "PLACE ORDER"}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - Cart Summary */}
          <div>
            <div className="flex justify-between items-center mt-3">
              <h2 className="text-2xl font-bold">YOUR CART</h2>
              <button
                onClick={() => navigate("/cart")}
                className="text-base font-bold underline hover:no-underline"
              >
                EDIT
              </button>
            </div>

            {cartSummary ? (
              <>
                <div className="mb-3">
                  <div className="space-y-3 mb-3">
                    <div className="flex justify-between text-base">
                      <span>{cartSummary.total_items} items</span>
                      <span>₹{cartSummary.total_price}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span>Delivery</span>
                      <span>Free</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-4 mb-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-lg">
                        ₹{cartSummary.total_price}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      (Inclusive of all taxes)
                    </p>
                  </div>
                </div>

                {cartSummary.items.map((item) => (
                  <div key={item.id} className="flex gap-4 mb-4">
                    <div className="w-20 h-20 bg-gray-50 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-base mb-2">
                        {item.product.name}
                      </h5>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ₹{item.total_price}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>Loading cart...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
