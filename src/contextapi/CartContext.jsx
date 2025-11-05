// CartContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import AuthContext from "./AuthContext";
import { toast } from "react-toastify";
import {
  AddToCartApi,
  CartListApi,
  DeleteCartApi,
  UpdateCartApi,
} from "../services/productSerives";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], total_cart_price: 0 });

  const cartCount = cart.items.length;

  // ✅ Fetch cart when user logs in
  useEffect(() => {
    if (currentUser) fetchCart();
  }, [currentUser]);

  // ✅ Get Cart from backend
  const fetchCart = async () => {
    try {
      const res = await CartListApi();
      setCart(res); // backend returns { items: [...], total_cart_price: ... }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  //Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!currentUser) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      const payload = { product_id: product.id, quantity };
      const res = await AddToCartApi(payload);
      // update local cart state
      const updatedItems = [...cart.items];
      const existingIndex = updatedItems.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex !== -1) {
        updatedItems[existingIndex] = res;
      } else {
        updatedItems.push(res);
      }
      const total = updatedItems.reduce(
        (acc, item) => acc + (item.product?.price || 0) * item.quantity,
        0
      );
      setCart({ items: updatedItems, total_cart_price: total });
      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart");
    }
  };

  //Increment quantity
  const increment = async (cartItemId) => {
    try {
      const cartItem = cart.items.find((item) => item.id === cartItemId);
      if (!cartItem) return;
      const updated = await UpdateCartApi(cartItemId, cartItem.quantity + 1);
      const updatedItems = cart.items.map((it) =>
        it.id === cartItemId ? updated : it
      );
      const total = updatedItems.reduce(
        (acc, it) => acc + (it.product?.price || 0) * it.quantity,
        0
      );
      setCart({ items: updatedItems, total_cart_price: total });
    } catch (err) {
      console.error("Error incrementing quantity:", err);
    }
  };

  //Decrement quantity
  const decrement = async (cartItemId) => {
    try {
      const cartItem = cart.items.find((item) => item.id === cartItemId);
      if (!cartItem) return;
      if (cartItem.quantity <= 1) return;
      const newQuantity = cartItem.quantity - 1;
      const updated = await UpdateCartApi(cartItemId, newQuantity);
      const updatedItems = cart.items.map((it) =>
        it.id === cartItemId ? updated : it
      );
      const total = updatedItems.reduce(
        (acc, it) => acc + (it.product?.price || 0) * it.quantity,
        0
      );
      setCart({ items: updatedItems, total_cart_price: total });
    } catch (err) {
      console.error("Error decrementing quantity:", err);
    }
  };
  // Clear entire cart
  const deleteCartItem = async (cartItemId) => {
    try {
      await DeleteCartApi(cartItemId);
      setCart((prev) => {
        const updatedItems = prev.items.filter(
          (item) => item.id !== cartItemId
        );
        const total = updatedItems.reduce(
          (acc, it) => acc + (it.product?.price || 0) * it.quantity,
          0
        );
        return { items: updatedItems, total_cart_price: total };
      });
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increment,
        decrement,
        deleteCartItem ,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
