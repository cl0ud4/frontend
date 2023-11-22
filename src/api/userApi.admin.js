import client from "./client.js";

const adminSignup = async (data) => {
  try {
    const response = await client.post(`/signup/admin`, data);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
};

const mailSend = async (userId) => {
  try {
    const response = await client.post(`/app/mail/send`, {
      studentId: userId
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
};

const mailCheck = async (userId, authNum) => {
  try {
    const response = await client.post(`/app/mail/check`, {
      studentId: userId,
      mailAuthenticationNumber: authNum
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
};

export { adminSignup, mailSend, mailCheck };
