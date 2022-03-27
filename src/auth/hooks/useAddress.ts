import { useConnectedWallet } from "@web4/wallet-provider"
import useAuth from "./useAuth"

/* auth | walle-provider */
const useAddress = () => {
  const connected = useConnectedWallet()
  const { wallet } = useAuth()
  return wallet?.address ?? connected?.iqAddress
}

export default useAddress
