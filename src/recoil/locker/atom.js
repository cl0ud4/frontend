import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "sessionStorage",
  storage: sessionStorage,
});

export const showErrorToastAtom = atom({
  key: "show",
  default: null,
});

export const adminAtom = atom({
  key: "admin",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// 현재 유저를 받아오는 atom
export const userAtom = atom({
  key: "user",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const lockerInfoAtom = atom({
  key: "info",
  default: { location: "", deposit: 0, row: 0, col: 0, order: "" },
  effects_UNSTABLE: [persistAtom],
});

export const lockerIdsAtom = atom({
  key: "ids",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const idArrayAtom = atom({
  key: "tmp_ids",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const lockerListAtom = atom({
  key: "lockers",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
