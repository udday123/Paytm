import { useRecoilValue } from "recoil"
import { balanceAtom } from "@/store/balance"

export const useBalance = () => {
    const value = useRecoilValue(balanceAtom);
    return value;
}