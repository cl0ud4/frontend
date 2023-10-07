import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "sessionStorage",
  storage: sessionStorage,
});

export const askMenuAtom = atom({
  key: "ask",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const lockerMenuAtom = atom({
  key: "locker",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const mypageMenuAtom = atom({
  key: "mypage",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const showWraningToastATom = atom({
  key: "warningToast",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const showInfoToastATom = atom({
  key: "infoToast",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
