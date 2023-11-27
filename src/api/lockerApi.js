import client from "./client.js";

const postLockersInfo = async (lockerInfo) => {
  try {
    const response = await client.post(`/nemo/lockers-info`, {
      location: lockerInfo.location,
      deposit: lockerInfo.deposit,
      row: lockerInfo.row,
      col: lockerInfo.col,
      order: lockerInfo.order,
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getLockersDepInfo = async (department) => {
  try {
    const response = await client.get(`/nemo/lockers-info?department=${department}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getUserLockerCheck = async () => {
  try {
    const response = await client.get(`/nemo/check`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const deleteLocker = async () => {
  try {
    const response = await client.delete(`/nemo/lockers`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const getLockersDepartment = async (department) => {
  try {
    const response = await client.get(`/nemo/lockers?department=${department}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postLockerInfo = async (lockerId) => {
   try {
     const response = await client.post(`/nemo/lockers-info/number`, {
      lockerIds: lockerId
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const patchLocker = async (lockerId, userId, node, status) => {
  try {
     const response = await client.patch(`/nemo/locker/${lockerId}`, {
       userId,
       node,
       status
    });
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postLockerRent = async (lockerId) => {
  try {
     const response = await client.post(`/nemo/locker/rent/${lockerId}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postLockerCancel = async (lockerId) => {
  try {
     const response = await client.post(`/nemo/locker/cancel/${lockerId}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postLockerCancelReturn = async (lockerId) => {
  try {
     const response = await client.post(`/nemo/locker/cancel-return/${lockerId}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

const postLockerReturn = async (lockerId) => {
  try {
     const response = await client.post(`/nemo/locker/return/${lockerId}`);
    return response;
  } catch (error) {
    console.log("실패!", error);
    return error;
  }
}

export {
  postLockersInfo, getLockersDepInfo, getUserLockerCheck,
  postLockerReturn, deleteLocker,
  getLockersDepartment, postLockerInfo,
  patchLocker, postLockerRent, postLockerCancel, postLockerCancelReturn
}