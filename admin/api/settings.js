import axiosInstance from '../utils/axiosInstance';

const taskRequests = {
  getSettings: async () => {
    const data = await axiosInstance.get('/shopify/settings');
    return data;
  },
};
export default taskRequests;
