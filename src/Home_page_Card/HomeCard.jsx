import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import api from "../Common API/api";
import { productListView } from "../services/productSerives";
// import { Api } from "../commonapi/api";

function HomeCard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productListView()
      .then((res) => setProducts(res.products.slice(0, 4)))
      .catch((err) => console.log(err.message));
  }, []);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="relative group bg-white border rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Wishlist */}
              <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10">
                <Heart size={18} />
              </button>

              {/* New Badge */}
              {product.is_new && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                  NEW
                </span>
              )}

              {/* Image */}
              <div className="bg-gray-100 h-40 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-32 object-contain transition-transform duration-300 group-hover:scale-135"
                />
              </div>

              {/* Info */}
              <div className="px-4 py-3 text-center">
                <h5 className="text-sm font-medium text-gray-800 mb-1">
                  {product.name}
                </h5>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-black font-bold text-base mt-1">
                  ₹{product.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No Products Found
          </p>
        )}
      </div>
    </div>
  );
}

export default HomeCard;
