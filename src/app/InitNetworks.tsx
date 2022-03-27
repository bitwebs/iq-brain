import { FC, useEffect, useState } from "react"
import { fromPairs } from "ramda"
import axios from "axios"
import { ASSETS } from "config/constants"
import createContext from "utils/createContext"
import { useCustomNetworks } from "data/settings/CustomNetworks"

export const [useNetworks, NetworksProvider] =
  createContext<CustomNetworks>("useNetworks")

const InitNetworks: FC = ({ children }) => {
  const [networks, setNetworks] = useState<CustomNetworks>()
  const { list } = useCustomNetworks()

  useEffect(() => {
    const fetchChains = async () => {
      const { data: chains } = await axios.get<IqNetworks>("/chains.json", {
        baseURL: ASSETS,
      })

      const networks = {
        ...chains,
        localiq: { ...chains.localiq, preconfigure: true },
      }

      setNetworks({
        ...networks,
        ...fromPairs(list.map((item) => [item.name, item])),
      })
    }

    fetchChains()
  }, [list])

  if (!networks) return null
  return <NetworksProvider value={networks}>{children}</NetworksProvider>
}

export default InitNetworks
