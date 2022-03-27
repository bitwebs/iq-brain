import { FC } from "react"
import { Coins } from "@web4/iq.js"
import createContext from "utils/createContext"
import { combineState } from "data/query"
import { useActiveDenoms, useExchangeRates } from "data/queries/oracle"
import { IqContracts } from "data/Iq/IqAssets"
import { useCW20Pairs } from "data/Iq/IqAssets"
import { useIqContracts } from "data/Iq/IqAssets"
import { Fetching } from "components/feedback"

interface Swap {
  activeDenoms: Denom[]
  exchangeRates: Coins
  pairs: CW20Pairs
  contracts?: IqContracts
}

export const [useSwap, SwapProvider] = createContext<Swap>("useSwap")

const SwapContext: FC = ({ children }) => {
  const { data: activeDenoms, ...activeDenomsState } = useActiveDenoms()
  const { data: exchangeRates, ...exchangeRatesState } = useExchangeRates()
  const { data: pairs, ...cw20PairsState } = useCW20Pairs()
  const { data: contracts, ...contractsState } = useIqContracts()

  const state = combineState(
    activeDenomsState,
    exchangeRatesState,
    contractsState,
    cw20PairsState
  )

  const render = () => {
    if (!(activeDenoms && exchangeRates && pairs && contracts)) return null
    const value = { activeDenoms, exchangeRates, pairs, contracts }
    return <SwapProvider value={value}>{children}</SwapProvider>
  }

  return !state.isSuccess ? null : <Fetching {...state}>{render()}</Fetching>
}

export default SwapContext
