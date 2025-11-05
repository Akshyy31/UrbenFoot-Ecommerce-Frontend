import React, { useContext } from "react";
import { Heart, X } from "lucide-react";
import CartContext from "../contextapi/CartContext";
import AuthContext from "../contextapi/AuthContext";
import Navbar1 from "../Navbar/Navbar1";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

export default function ShoppingCart() {
  const { cart, increment, decrement, deleteCartItem } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const totalPrice = cart?.total_cart_price || 0;

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div>
        <Navbar1 />
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Your Bag is Empty 🛍️</h1>
          <p className="text-gray-600 mb-5 text-sm sm:text-base">
            Looks like you haven't added anything yet. Start shopping now!
          </p>
          <Link
            to="/productlist"
            className="px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar1 />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* LEFT SECTION — CART ITEMS */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 mt-2">
                YOUR BAG{" "}
                <span className="text-xl sm:text-2xl font-normal">
                  ({cart.items.length} items)
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Items in your bag are not reserved — check out now to make them yours.
              </p>
            </div>

            {/* CART ITEMS LIST */}
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 relative mb-4 shadow-sm"
              >
                {/* REMOVE BUTTON */}
                <button
                  onClick={() => {
                    if (window.confirm("Remove this item from cart?")) {
                      deleteCartItem(item.id);
                    }
                  }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 hover:bg-gray-100 p-1 rounded"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* PRODUCT IMAGE */}
                <div className="w-full sm:w-36 h-36 bg-gray-50 flex items-center justify-center rounded-md">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-32 h-32 object-contain"
                  />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-semibold text-lg sm:text-xl mb-2">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-700">
                      ₹{item.product?.price?.toLocaleString("en-IN")}.00
                    </p>
                    <p className="text-xs text-green-600 mt-1">In Stock</p>
                  </div>

                  {/* QUANTITY CONTROL */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => decrement(item.id)}
                      className="w-8 h-8 border flex items-center justify-center hover:bg-gray-100 rounded"
                    >
                      −
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="w-8 h-8 border flex items-center justify-center hover:bg-gray-100 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* PRICE */}
                <div className="text-right flex flex-col justify-between sm:w-32">
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}.00
                  </p>
                  <button className="hover:bg-gray-100 p-2 rounded self-end mt-2 sm:mt-0">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SECTION — ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 border mt-5 border-gray-100 p-5 rounded-md shadow-sm ">
              <h2 className="text-2xl font-bold mb-5 text-center lg:text-left">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between p-1">
                  <span>{cart.items.length} item(s)</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="flex justify-between p-1">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between p-1">
                  <span>Discount</span>
                  <span>- ₹0.00</span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">
                    ₹{totalPrice.toLocaleString("en-IN")}.00
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-right">
                  (Inclusive of all taxes)
                </p>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                onClick={() => {
                  if (!currentUser) {
                    toast.error("Please login to proceed to checkout");
                  } else {
                    navigate("/check-out");
                  }
                }}
                className="w-full bg-black text-white py-2 font-bold hover:bg-gray-900 flex items-center justify-between group rounded-md"
              >
                <span className="p-2 text-sm sm:text-base">CHECKOUT</span>
                <span className="text-2xl group-hover:translate-x-1 transition-transform p-2">
                  →
                </span>
              </button>

              <Link
                to="/productlist"
                className="mt-4 block text-center border border-black text-black py-2 rounded-md hover:bg-gray-100 transition text-sm font-medium"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
