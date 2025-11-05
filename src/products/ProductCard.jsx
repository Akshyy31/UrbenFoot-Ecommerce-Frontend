import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import WishlistContext from "../contextapi/WishListContext"; // ✅ Make sure this path matches your project

function ProductCard({ productList }) {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const handleWishlistClick = (e, product) => {
    e.stopPropagation(); // Prevent link navigation
    toggleWishlist(product);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {productList && productList.length > 0 ? (
        productList.map((product) => (
          <div
            key={product.id}
            className="relative group bg-white  border rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Wishlist Icon */}
            <button
              onClick={(e) => handleWishlistClick(e, product)}
              className={`absolute top-3 right-3 z-10 w-5 h-5 p-0.5  flex items-center justify-center 
    !rounded-full 
    ${
      isInWishlist(product.id)
        ? "bg-red-100 text-red-500"
        : "bg-gray-100 text-gray-500"
    } 
    hover:scale-110 transition 
    !outline-none !focus:outline-none`}
              title={
                isInWishlist(product.id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }
            >
              <Heart
                size={22}
                className={isInWishlist(product.id) ? "fill-current" : ""}
              />
            </button>

            {/* New Badge */}
            {product.isNew && (
              <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded z-10 shadow-sm">
                New
              </span>
            )}

            {/* Product Image */}
            <div className="bg-gray-100 h-48 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-40 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="px-4 py-3">
              <h5 className="text-base font-semibold text-gray-800 text-center mb-1">
                {product.name}
              </h5>
              <p className="text-sm text-gray-500 text-center line-clamp-2">
                {product.description}
              </p>
              <p className="text-center text-indigo-600 font-bold text-lg mt-2">
                ₹{product.price}
              </p>
            </div>

            {/* View Details Button */}
            <Link
              to={`/product-detail/${product.id}/`}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 !bg-black !text-white text-sm font-medium px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition duration-300"
            >
              View Details
            </Link>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No Products Found
        </p>
      )}
    </div>
  );
}

export default ProductCard;
