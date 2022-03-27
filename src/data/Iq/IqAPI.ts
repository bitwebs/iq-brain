import { useMemo } from "react"
import { useQuery } from "react-query"
import axios, { AxiosError } from "axios"
import BigNumber from "bignumber.js"
import { OracleParams, ValAddress } from "@web4/iq.js"
import { IqValidator } from "types/validator"
import { IqProposalItem } from "types/proposal"
import { useNetworkName } from "data/wallet"
import { useOracleParams } from "data/queries/oracle"
import { queryKey, RefetchOptions } from "../query"

export enum Aggregate {
  PERIODIC = "periodic",
  CUMULATIVE = "cumulative",
}

export enum AggregateStakingReturn {
  DAILY = "daily",
  ANNUALIZED = "annualized",
}

export enum AggregateWallets {
  TOTAL = "total",
  NEW = "new",
  ACTIVE = "active",
}

export const useIqAPIURL = (network?: string) => {
  const networkName = useNetworkName()
  return {
    mainnet: "https://api.iqchain.network",
    testnet: "https://mcafee-api.iqchain.network",
  }[network ?? networkName]
}

export const useIsIqAPIAvailable = () => {
  const url = useIqAPIURL()
  return !!url
}

export const useIqAPI = <T>(path: string, params?: object, fallback?: T) => {
  const baseURL = useIqAPIURL()
  const available = useIsIqAPIAvailable()
  const shouldFallback = !available && fallback

  return useQuery<T, AxiosError>(
    [queryKey.IqAPI, baseURL, path, params],
    async () => {
      if (shouldFallback) return fallback
      const { data } = await axios.get(path, { baseURL, params })
      return data
    },
    { ...RefetchOptions.INFINITY, enabled: !!(baseURL || shouldFallback) }
  )
}

/* fee */
export type GasPrices = Record<Denom, Amount>

export const useGasPrices = () => {
  const current = useIqAPIURL()
  const mainnet = useIqAPIURL("mainnet")
  const baseURL = current ?? mainnet
  const path = "/gas-prices"

  return useQuery(
    [queryKey.IqAPI, baseURL, path],
    async () => {
      const { data } = await axios.get<GasPrices>(path, { baseURL })
      return data
    },
    { ...RefetchOptions.INFINITY, enabled: !!baseURL }
  )
}

/* charts */
export enum ChartInterval {
  "1m" = "1m",
  "5m" = "5m",
  "15m" = "15m",
  "30m" = "30m",
  "1h" = "1h",
  "1d" = "1d",
}

export const useBiqPriceChart = (denom: Denom, interval: ChartInterval) => {
  return useIqAPI<ChartDataItem[]>(`chart/price/${denom}`, { interval })
}

export const useTxVolume = (denom: Denom, type: Aggregate) => {
  return useIqAPI<ChartDataItem[]>(`chart/tx-volume/${denom}/${type}`)
}

export const useStakingReturn = (type: AggregateStakingReturn) => {
  return useIqAPI<ChartDataItem[]>(`chart/staking-return/${type}`)
}

export const useTaxRewards = (type: Aggregate) => {
  return useIqAPI<ChartDataItem[]>(`chart/tax-rewards/${type}`)
}

export const useWallets = (walletsType: AggregateWallets) => {
  const type =
    walletsType === AggregateWallets.TOTAL ? "cumulative" : "periodic"
  return useIqAPI<ChartDataItem[]>(`chart/wallets/${walletsType}/${type}`)
}

/* validators */
export const useIqValidators = () => {
  return useIqAPI<IqValidator[]>("validators", undefined, [])
}

export const useIqValidator = (address: ValAddress) => {
  return useIqAPI<IqValidator>(`validators/${address}`)
}

export const useIqProposal = (id: number) => {
  return useIqAPI<IqProposalItem[]>(`proposals/${id}`)
}

/* helpers */
export const getCalcVotingPowerRate = (IqValidators: IqValidator[]) => {
  const total = BigNumber.sum(
    ...IqValidators.map(({ voting_power = 0 }) => voting_power)
  ).toNumber()

  return (address: ValAddress) => {
    const validator = IqValidators.find(
      ({ operator_address }) => operator_address === address
    )

    if (!validator) return
    const { voting_power } = validator
    return voting_power ? Number(validator.voting_power) / total : undefined
  }
}

export const calcSelfDelegation = (validator?: IqValidator) => {
  if (!validator) return
  const { self, tokens } = validator
  return self ? Number(self) / Number(tokens) : undefined
}

export const getCalcUptime = ({ slash_window }: OracleParams) => {
  return (validator?: IqValidator) => {
    if (!validator) return
    const { miss_counter } = validator
    return miss_counter ? 1 - Number(miss_counter) / slash_window : undefined
  }
}

export const useVotingPowerRate = (address: ValAddress) => {
  const { data: IqValidators, ...state } = useIqValidators()
  const calcRate = useMemo(() => {
    if (!IqValidators) return
    return getCalcVotingPowerRate(IqValidators)
  }, [IqValidators])

  const data = useMemo(() => {
    if (!calcRate) return
    return calcRate(address)
  }, [address, calcRate])

  return { data, ...state }
}

export const useUptime = (validator: IqValidator) => {
  const { data: oracleParams, ...state } = useOracleParams()

  const calc = useMemo(() => {
    if (!oracleParams) return
    return getCalcUptime(oracleParams)
  }, [oracleParams])

  const data = useMemo(() => {
    if (!calc) return
    return calc(validator)
  }, [calc, validator])

  return { data, ...state }
}
