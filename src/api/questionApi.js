import client from "./client.js";

const getQuestionList = async () => {
  try {
    const response = await client.get(`/question`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getQuestion = async (id) => {
  try {
    const response = await client.get(`/question/${id}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getQuestionAnswer = async (id) => {
  try {
    const response = await client.get(`/question/${id}/answer`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postQuestion = async (questionContent) => {
  try {
    const response = await client.post(`/question/writing`, {
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

const postQuestionAnswer = async (id, questionContent) => {
  try {
    const response = await client.post(`/question/${id}/answer`, {
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

const deleteQuestion = async (id) => {
  try {
    const response = await client.delete(`/question/${id}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const deleteQuestionAnswer = async (id) => {
  try {
    const response = await client.delete(`/question/${id}/answer`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getQuestionListCnt = async (department) => {
  try {
    const response = await client.get(`/question/cnt?department=${department}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getQuestionListFilter = async (department) => {
  try {
    const response = await client.get(`/question?department=${department}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}





export {
    getQuestion, postQuestion, deleteQuestion,
    getQuestionAnswer, postQuestionAnswer, deleteQuestionAnswer,
    getQuestionListCnt, getQuestionList, getQuestionListFilter
}