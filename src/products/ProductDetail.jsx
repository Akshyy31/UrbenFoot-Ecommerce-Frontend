import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../contextapi/AuthContext";
import CartContext from "../contextapi/CartContext";
import WishlistContext from "../contextapi/WishListContext";
import Navbar1 from "../Navbar/Navbar1";
import Footer from "../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { productDetailViewApi } from "../services/productSerives";
import swal from "sweetalert";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { addToCart, cart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("7");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productDetailViewApi(id);
        setProduct(res.product || res);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  //Add to cart
  const handleAddToCart = () => {
    if (!currentUser) return navigate("/login");

    const alreadyInCart = cart.items.some(
      (item) => item.product.id === product.id
    );

    if (alreadyInCart) {
      swal("Already in Cart", "This item is already in your cart.", "warning");
      return;
    }

    addToCart(product, quantity);
  };

  //Toggle wishlist (add/remove)
  const handleToggleWishlist = async () => {
    if (!currentUser) return navigate("/login");

    const currentlyInWishlist = isInWishlist(product.id); // check before toggle
    await toggleWishlist(product);

    toast.info(
      currentlyInWishlist ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div>
      <Navbar1 />
      <div className="container mx-auto p-4 min-h-screen">
        <ToastContainer />

        <div className="max-w-8xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shadow-md rounded-lg p-4 bg-amber-100">
            {/* 🖼 Product Image */}
            <div className="flex flex-col gap-4 justify-center items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-[400px] object-contain"
              />
              <div className="grid grid-cols-3 gap-2">
                {product.image1 && (
                  <img
                    src={product.image1}
                    className="h-24 bg-white p-2 rounded"
                    alt="img1"
                  />
                )}
                {product.image2 && (
                  <img
                    src={product.image2}
                    className="h-24 bg-white p-2 rounded"
                    alt="img2"
                  />
                )}
                {product.image3 && (
                  <img
                    src={product.image3}
                    className="h-24 bg-white p-2 rounded"
                    alt="img3"
                  />
                )}
              </div>
            </div>

            {/* 📝 Product Details */}
            <div className="space-y-4">
              {/* ❤️ Wishlist Button */}
              <div className="flex justify-end text-3xl">
                {isInWishlist(product.id) ? (
                  <FaHeart
                    onClick={handleToggleWishlist}
                    className="text-red-500 cursor-pointer"
                  />
                ) : (
                  <FaRegHeart
                    onClick={handleToggleWishlist}
                    className="text-gray-400 cursor-pointer"
                  />
                )}
              </div>

              <h2 className="text-2xl text-red-500 font-bold">
                {product.name}
              </h2>
              <p className="text-gray-600">{product.description}</p>
              <div className="text-lg font-semibold text-black">
                ₹ {Number(product.price || 0).toLocaleString()}
              </div>

              {/* 👟 Size Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.available_sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border px-3 py-1 rounded-full text-sm ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {size}
                    </button>
                  )) || <span>No sizes available</span>}
                </div>
              </div>

              {/* 🔢 Quantity */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-1 border rounded"
                  >
                    -
                  </button>
                  <span className="w-10 text-center">
                    {String(quantity).padStart(2, "0")}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 🛍 Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="w-1/2 bg-red-600 text-white py-3 rounded hover:bg-red-700"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="w-1/2 border border-gray-400 text-gray-700 py-3 rounded hover:bg-gray-100"
                >
                  {isInWishlist(product.id)
                    ? "♥ REMOVE FROM WISHLIST"
                    : "♡ ADD TO WISHLIST"}
                </button>
              </div>

              {/* ℹ️ Additional Info */}
              <div className="p-4 border-t mt-2">
                <h3 className="font-bold text-xl mb-2">Product Details</h3>
                <p>
                  <strong>Brand:</strong> {product.brand}
                </p>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>
                  <strong>Price:</strong> ₹{product.price}
                </p>
                <p>
                  <strong>Stock:</strong>{" "}
                  {product.in_stock ? "In Stock" : "Available"}
                </p>
                <p>
                  <strong>More:</strong> {product.additional_details}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;
