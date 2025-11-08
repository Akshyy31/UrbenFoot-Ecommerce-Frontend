import api from '../Common API/api'

export const adminUserListApi = async ()=>{
    const res = await api.get('adminside/userlist/');
    return res
};

export const blockUserApi = async (id, action) => {
  const res = await api.post(`adminside/block-user/${id}/`, { action });
  return res.data;
};