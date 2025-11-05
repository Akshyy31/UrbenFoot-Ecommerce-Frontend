import React, { useContext } from "react";
import { Heart, MessageSquare } from "lucide-react";
import WishlistContext from "../contextapi/WishListContext";
import CartContext from "../contextapi/CartContext";
import Navbar1 from "../Navbar/Navbar1";
import { toast } from "react-toastify";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart,cart } = useContext(CartContext);

  console.log(wishlist);
  

const handleAddToCart = (product) => {
  const alreadyInCart = cart.items.some(
    (item) => item.product.id === product.id
  );

  if (alreadyInCart) {
    toast.warning("This item is already in your cart 🛒");
    return;
  }

  addToCart(product, 1); // add quantity = 1 by default
  toast.success("Added to cart 🛍️");
};

  return (
    <div className="min-h-screen bg-white">
      <Navbar1 />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 text-center mt-3">
          <h1 className="text-3xl font-bold mb-1">MY WISHLIST</h1>
          <p className="text-sm text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? "ITEM" : "ITEMS"}
          </p>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 flex flex-col"
              >
                {/* Image + Heart */}
                <div className="relative bg-gray-100 overflow-hidden rounded-t-xl">
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 hover:bg-gray-50 transition"
                  >
                    <Heart className="w-4 h-4 fill-black text-black" />
                  </button>

                  {/* Product Image */}
                  <div className="h-40 flex items-center justify-center p-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="font-medium text-base text-gray-800 mb-1 line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    Brand: {item.product.brand}
                  </p>
                  <p className="text-base font-semibold text-indigo-600 mb-3">
                    ₹{item.product.price}
                  </p>

                  {/* Buttons */}
                  <div className="mt-auto flex gap-1.5">
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      className="flex-1 bg-black hover:bg-gray-900 text-white py-1.5 rounded-md text-xs transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.product.id)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-1.5 rounded-md text-xs transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base mb-3">
              Your wishlist is empty 😢
            </p>
            <p className="text-gray-500 text-sm">
              Start exploring our products and add your favorites!
            </p>
          </div>
        )}

        {/* App Promotion Section */}
        <div className="bg-gray-100 p-5 rounded-xl mt-5 shadow-sm text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
            Get more from your wishlist through the app
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
            <li className="flex justify-center sm:justify-start items-start p-3">
              <span className="mr-2 mt-0.5">•</span>
              <span>Instant notifications on items on sale or low in stock</span>
            </li>
            <li className="flex justify-center sm:justify-start items-start p-3">
              <span className="mr-2 mt-0.5">•</span>
              <span>Share your wishlist with friends and family</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Chat Floating Button */}
      <button className="fixed bottom-5 right-5 bg-white border-2 border-black rounded-full p-3 hover:bg-gray-50 shadow-lg transition">
        <MessageSquare className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}
