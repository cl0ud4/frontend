import client, { baseClient } from "./client.js";

const userSignup = async (data) => {
  try {
    const response = await baseClient.post(`/signup`, data);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
};

const signin = async (id, password) => {
  try {
    const response = await baseClient.post(`/signin`, {
      id: id, password: password
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getUser = async () => {
  try {
    const response = await client.get(`/app/user`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const patchUserPhone = async (phone) => {
  try {
    const response = await client.patch('/app/user', {
      phoneNumber: phone
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const patchDeleteUser = async (userId) => {
  try {
    const response = await client.patch('/user/goodbye', { id: userId });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const logout = async () => {
  try {
    const response = await client.patch('/logout');
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

export {
  userSignup, signin, logout,
  getUser, patchUserPhone, patchDeleteUser
};
