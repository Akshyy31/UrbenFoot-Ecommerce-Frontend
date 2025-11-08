import api from "../Common API/api";

export const adminProductListApi = async (
  page = 1,
  search = "",
  category = ""
) => {
  let url = `adminside/productslist/?page=${page}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category && category !== "ALL") url += `&category=${encodeURIComponent(category)}`;
  const res = await api.get(url);
  return res.data;
};
export const adminOrderListApi = async () => {
  const res = await api.get("adminside/dash_details/");
  return res.data;
};

export const adminAddProductApi = async (formData) => {
  const res = await api.post("adminside/product/add/management/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return res.data;
};

export const adminEditGetProductApi = async (id) => {
  const res = await api.get(`adminside/product/management/${id}/`);
  return res.data;
};

export const adminEditProductApi = async (id, data) => {
  const res = await api.patch(`adminside/product/management/${id}/`, data);
  return res.data;
};

export const adminDeleteProductApi = async (id) => {
  const res = api.delete(`adminside/product/management/${id}/`);
  return res.data;
};

export const categoryViewApi = async () => {
  const res = await api.get("adminside/category/");
  return res.data;
};
