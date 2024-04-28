import axios from 'axios';

const instance = axios.create({
  baseURL:`http://localhost:${import.meta.env.VITE_SERVER_PORT}/`,

  withCredentials: true,

  //for send http only cookie
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

instance.interceptors.request.use(
  (config) => {
    // console.log('axios.js request : ' , config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (res) => {
    // console.log('axios.js response : ' , res);
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
