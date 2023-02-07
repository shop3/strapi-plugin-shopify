import axiosInstance from '../utils/axiosInstance';

const plansRequests = {
  getPlans: async () => {
    const data = await axiosInstance.get('/api/shopify/plans');
    return data;
  },
  createPlans: async ( data ) => {
    const plans = await axiosInstance.post(`/api/shopify/plans/create`, JSON.stringify(data));
    return plans;
  },
  editPlans: async ( data, id ) => {
    const datas = {
      "id": id,
      "data": data,
    }
    const plans = await axiosInstance.put(`/api/shopify/plans/edit`, JSON.stringify(datas));
    return plans;
  },
  deletePlans: async ( id ) => {
    const data = {
      "id": id,
    }
    const plans = await axiosInstance.post(`/api/shopify/plans/delete`, JSON.stringify(data));
    return plans;
  }
};
export default plansRequests;
