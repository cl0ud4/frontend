import client from "./client.js";

const getNoticeList = async () => {
  try {
    const response = await client.get(`/notice`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getNotice = async (id) => {
  try {
    const response = await client.get(`/notice/${id}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postNotice = async (questionContent) => {
  try {
    const response = await client.post(`/notice/write`, {
          title: questionContent.title,
          content: questionContent.content,
          created_date: questionContent.created_date
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const deleteNotice = async (id) => {
  try {
    const response = await client.delete(`/notice/${id}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postSendNotice = async () => {
  try {
    const response = await client.post(`/notice/send`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getSendNoticeSms = async () => {
  try {
    const response = await client.get(`/notice/sms`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postSendNoticeWrite = async (content) => {
  try {
      const response = await client.post(`/notice/send/write`, {
        sms_content: content
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

export {
  getNoticeList, getNotice, postNotice, deleteNotice,
  postSendNotice, getSendNoticeSms, postSendNoticeWrite
}