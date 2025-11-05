// src/services/orderServices.js
import api from "../Common API/api";

export const createOrderApi = async (data) => {
  const res = await api.post("payments/create_order/", data);
  return res.data;
};

export const verifyPaymentApi = async (data) => {
  const res = await api.post("/payments/verify_payment/", data);
  return res.data;
};

export const orderListViewApi = async ()=>{
    const res = await api.get('/urbanfoot/orders/');
    return res.data
}
