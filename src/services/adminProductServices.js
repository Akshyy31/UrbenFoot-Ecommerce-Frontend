import api from '../Common API/api'

export const adminProductListApi = async  ()=>{
    const res = await api.get('adminside/productslist/');
    return res.data
};

export const adminOrderListApi=async()=>{
    const res= await api.get('adminside/dash_details/');
    return res.data
}