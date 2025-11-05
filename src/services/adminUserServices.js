import api from '../Common API/api'

export const adminUserListApi = async ()=>{
    const res = await api.get('adminside/userlist/');
    return res
};