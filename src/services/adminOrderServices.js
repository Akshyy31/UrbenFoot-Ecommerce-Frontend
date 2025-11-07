import api from "../Common API/api";

export const updateOrderStatusApi = async (orderId, newStatus) => {
  const res = await api.patch(`adminside/update/orders/${orderId}/status/`, {
    status: newStatus,
  });
  return res.data;
};

export const OrderSummaryViewApi = async () => {
  const res = await api.get(`adminside/order/status/summeryview/`);
  return res.data;
};
