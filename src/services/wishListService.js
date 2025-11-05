import api from "../Common API/api";

// ✅ Get all wishlist items
export const WishiListApi = async () => {
  const res = await api.get("/urbanfoot/wishlist_view/");
  return res;
};

// ✅ Add product to wishlist
export const AddToWishListApi = async (product_id) => {
  const res = await api.post("/urbanfoot/wishlist_view/", { product_id });
  return res; // keep full response (not just res.data)
};

// ✅ Delete product from wishlist
export const DeleteWishListApi = async (product_id) => {
  const res = await api.delete("/urbanfoot/wishlist_view/", {
    data: { product_id },
  });
  return res;
};
