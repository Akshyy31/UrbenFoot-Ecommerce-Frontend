import React, { useContext } from "react";
import CartContext from "../contextapi/CartContext";
import Navbar1 from "../Navbar/Navbar1";
import { Link } from "react-router-dom";
import AuthContext from "../contextapi/AuthContext";
import { useNavigate } from "react-router-dom";

function SampleCart() {
  const { cart, increment, decrement, removeFromCart, clearCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <Navbar1 />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Your Shopping Cart ({cart.length})
        </h1>

        {cart.length === 0 ? (
          <div className="bg-gray-100 text-center py-20 rounded-lg">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              There are no products in your Shopping Cart.
            </h2>
            <Link
              to="/productlist"
              className="inline-block mt-4 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
            >
              Browse Products
            </Link>
            <div className="mt-10 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">POPULAR SEARCHES</h3>
              <p className="text-sm text-gray-600">
                Women's Shoes | Walking Shoes for Women | Walking Shoes for Men | Men's Shoes | Running Shoes for Women | Running Shoes for Men | Women's Slippers | Men's Slippers | Kids Shoes | Slip-Ins | Men's Jackets | Women's Jacket | Men's T-Shirts | Sports Bra | Arch Fit Shoes | Memory Foam | Goga Mat | GO Walk | James Gold Crown Collection | GO Run | Mark Nason | Kids Light Up Shoes | Tokidoki | Shoes Sale | Running Shoes | Walking Shoes | Trail-Hiking | Black Shoes | White Shoes | Pink Shoes | Blue Shoes
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-sm text-gray-600">
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => decrement(item.id)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                        >
                          −
                        </button>
                        <span className="px-4 text-lg">{item.quantity}</span>
                        <button
                          onClick={() => increment(item.id)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        "Are you sure to Remove the item"
                      );
                      if (confirmDelete) removeFromCart(item.id);
                    }}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 flex justify-between items-center">
              <p className="text-xl font-bold">Total: ₹{totalPrice}</p>
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      alert("Please log in to proceed to checkout.");
                    } else {
                      navigate("/check-out");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default  SampleCart;