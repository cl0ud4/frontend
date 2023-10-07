import { useSetRecoilState } from "recoil";

import { askMenuAtom, lockerMenuAtom, mypageMenuAtom } from "./atom.js";

export const useAskMenu = () => {
  const setAskMenu = useSetRecoilState(askMenuAtom);
  const setLockerMenu = useSetRecoilState(lockerMenuAtom);
  const setMypageMenu = useSetRecoilState(mypageMenuAtom);

  return { setAskMenu, setLockerMenu, setMypageMenu };
};

export function useLockerMenu() {
  const setAskMenu = useSetRecoilState(askMenuAtom);
  const setLockerMenu = useSetRecoilState(lockerMenuAtom);
  const setMypageMenu = useSetRecoilState(mypageMenuAtom);

  return { setAskMenu, setLockerMenu, setMypageMenu };
}

export const useMypagerMenu = () => {
  const setAskMenu = useSetRecoilState(askMenuAtom);
  const setLockerMenu = useSetRecoilState(lockerMenuAtom);
  const setMypageMenu = useSetRecoilState(mypageMenuAtom);

  return { setAskMenu, setLockerMenu, setMypageMenu };
};
