import axios from "axios";

export const baseClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/`,
});

const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/`,
});

client.interceptors.request.use(async (request) => {
  const jwtToken = sessionStorage.getItem("jwt");
  request.headers["nemo-access-token"] = jwtToken ? jwtToken : "";
  return request;
});

export default client;
