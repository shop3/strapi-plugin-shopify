import axiosInstance from '../utils/axiosInstance';

const plansRequests = {
  getPlans: async () => {
    const data = await axiosInstance.get('/shopify/plans');
    return data;
  },
  createPlans: async ( data ) => {
    const plans = await axiosInstance.post(`/shopify/plans/create`, JSON.stringify(data));
    return plans;
  },
  editPlans: async ( data, id ) => {
    const plans = await axiosInstance.put(`/shopify/plans/edit`, JSON.stringify({
      "id": id,
      "data": data,
    }));
    return plans;
  },
  deletePlans: async ( id ) => {
    const plans = await axiosInstance.post(`/shopify/plans/delete`, JSON.stringify({ "id": id }));
    return plans;
  }
};
export default plansRequests;
