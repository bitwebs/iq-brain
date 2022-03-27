type NetworkName = string
type IqNetworks = Record<NetworkName, IqNetwork>

interface IqNetwork {
  name: NetworkName
  chainID: string
  lcd: string
}

type CustomNetworks = Record<NetworkName, CustomNetwork>

interface CustomNetwork extends IqNetwork {
  preconfigure?: boolean
}
