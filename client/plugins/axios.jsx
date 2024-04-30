import axios from 'axios';


let addr;
if (import.meta.env.VITE_ENV === 'dev') addr = import.meta.env.VITE_DEV_IP;
if (import.meta.env.VITE_ENV === 'prd') addr = import.meta.env.VITE_PRD_IP;
console.log(addr)
const instance = axios.create({
  baseURL: `http://${addr}:${import.meta.env.VITE_SERVER_PORT}/geopf`,

  withCredentials: true,

  //for send http only cookie
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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
