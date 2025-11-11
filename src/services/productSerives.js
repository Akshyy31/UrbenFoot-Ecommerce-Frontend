import api from "../Common API/api";

export const productListView = async () => {
  const res = await api.get("/urbanfoot/productview/");
  return res.data;
};

export const productDetailViewApi = async (id) => {
  const res = await api.get(`/urbanfoot/product_detail/${id}/`);
  return res.data;
};

export const CartListApi = async () => {
  const res = await api.get("/urbanfoot/cart_view/");
  return res.data;
};

export const AddToCartApi = async (data) => {
  const res = await api.post("/urbanfoot/cart_view/", data);
  return res.data;
};

export const UpdateCartApi = async (cartItemId, quantity) => {
  const payload = { cart_id: cartItemId, quantity };
  const res = await api.patch("/urbanfoot/cart_view/", payload);
  return res.data;
};

export const DeleteCartApi = async (id) => {
  const res = await api.delete("/urbanfoot/cart_view/", {
    data: { cart_id: id },
  });
  return res.data;
};

export const FilterProductApi = async (filters = {}) => {
  const res = await api.get("/urbanfoot/product_filter/", { params: filters });
  return res.data;
};

export const mostOrderedProductApi = async()=>{
  const res = await api.get('urbanfoot/most-ordered-products/');
  return res.data
}

export const ContactApi  = async(data)=>{
  const res = await api.post('urbanfoot/contact/',data)
  return res.data
}