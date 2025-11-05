import { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import {
  AddToWishListApi,
  WishiListApi,
  DeleteWishListApi,
} from "../services/wishListService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    if (currentUser) fetchWishlist();
    else setWishlist([]); 
  }, [currentUser]);

  const fetchWishlist = async () => {
    try {
      const res = await WishiListApi();
      setWishlist(res.data || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const addToWishlist = async (product) => {
  try {
    const res = await AddToWishListApi(product.id);
    if (res.data?.message === "Already in wishlist") return;

    const newItem = res.data?.wishlist_items;
    if (newItem) {
      setWishlist((prev) => [...prev, newItem]);
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

  const removeFromWishlist = async (productId) => {
    try {
      await DeleteWishListApi(productId);
      setWishlist((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const toggleWishlist = async (product) => {
    const exists = wishlist.some((item) => item.product.id === product.id);
    if (exists) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.product.id === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
