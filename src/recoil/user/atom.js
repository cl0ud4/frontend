import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "sessionStorage",
  storage: sessionStorage,
});

export const userjwtAtom = atom({
  key: "jwt",
  default: [null],
  effects_UNSTABLE: [persistAtom],
});
