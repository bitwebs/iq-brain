import { useTranslation } from "react-i18next"
import { isDenomBiq, isDenomIq } from "@web4/hubble-utils"
import { readPercent } from "@web4/hubble-utils"
import { toPrice } from "utils/num"
import { useMarketParams } from "data/queries/market"
import { useOracleParams } from "data/queries/oracle"
import { Read } from "components/token"
import { TooltipIcon } from "components/display"
import { PayloadOnchain, PayloadIqswap } from "../useSwapUtils"
import { PayloadRouteswap } from "../useSwapUtils"
import { SwapMode } from "../useSwapUtils"
import { SlippageParams, SwapSpread, useSingleSwap } from "../SingleSwapContext"
import Price from "./Price"

interface Props extends SlippageParams, SwapSpread {
  mode: SwapMode
  isLoading: boolean
  rate?: Price
  payload?: PayloadOnchain | PayloadIqswap | PayloadRouteswap
}

const ExpectedPrice = ({ mode, input, ...props }: Props) => {
  const { offerAsset, askAsset } = props
  const { price, rate, minimum_receive, payload, isLoading } = props
  const { t } = useTranslation()

  /* decimals */
  const { findDecimals } = useSingleSwap()
  const offerDecimals = findDecimals(offerAsset)
  const askDecimals = findDecimals(askAsset)

  /* query: native */
  const minSpread = useSwapSpread()
  const tobinTax = useTobinTax(askAsset)

  /* render: expected price */
  const renderPrice = (price?: Price) => <Price {...props} price={price} />

  const renderExpectedPrice = () => {
    return (
      <>
        <dt>{t("Expected price")}</dt>
        <dd>{!isLoading && renderPrice(price)}</dd>
      </>
    )
  }

  /* render: by mode */
  const renderOnchain = () => {
    const spread = payload as PayloadOnchain

    const tooltip = (
      <>
        {[offerAsset, askAsset].some(isDenomBiq) && (
          <p>
            {t("Minimum Biq swap spread: {{minSpread}}", {
              minSpread: readPercent(minSpread),
            })}
          </p>
        )}

        {askAsset && isDenomIq(askAsset) && tobinTax && (
          <p>
            {t("Iq tobin tax: {{tobinTax}}", {
              tobinTax: readPercent(tobinTax),
            })}
          </p>
        )}
      </>
    )

    return (
      <>
        <dt>{t("Oracle price")}</dt>
        <dd>{renderPrice(rate)}</dd>
        {renderExpectedPrice()}
        <dt>
          <TooltipIcon content={tooltip}>{t("Spread")}</TooltipIcon>
        </dt>
        <dd>
          {!isLoading && (
            <Read amount={spread} denom={askAsset} decimals={askDecimals} />
          )}
        </dd>
      </>
    )
  }

  const renderIqswap = () => {
    const fee = payload as PayloadIqswap

    const decimals = askDecimals - offerDecimals
    const price = toPrice(Number(rate) * Math.pow(10, decimals))

    return (
      <>
        {!!price && (
          <>
            <dt>{t("Pair price")}</dt>
            <dd>{renderPrice(price)}</dd>
          </>
        )}

        {renderExpectedPrice()}

        <dt>{t("Trading fee")}</dt>
        <dd>
          {!isLoading && (
            <Read amount={fee} denom={askAsset} decimals={askDecimals} />
          )}
        </dd>
      </>
    )
  }

  const renderRouteswap = () => {
    return <>{renderExpectedPrice()}</>
  }

  const renderByMode = (mode: SwapMode) =>
    ({
      [SwapMode.ONCHAIN]: renderOnchain,
      [SwapMode.IQSWAP]: renderIqswap,
      [SwapMode.ASTROPORT]: renderIqswap,
      [SwapMode.ROUTESWAP]: renderRouteswap,
    }[mode]())

  /* render: minimum received */
  const renderMinimumReceived = () => {
    return (
      <>
        <dt>{t("Minimum received")}</dt>
        <dd>
          {!isLoading && (
            <Read
              amount={minimum_receive}
              token={askAsset}
              decimals={findDecimals(askAsset)}
            />
          )}
        </dd>
      </>
    )
  }

  if (!Number.isFinite(price)) return null

  return (
    <dl>
      {mode && renderByMode(mode)}
      {renderMinimumReceived()}
    </dl>
  )
}

export default ExpectedPrice

/* hooks */
const useSwapSpread = () => {
  const { data: marketParams } = useMarketParams()
  const minSpread = marketParams?.min_stability_spread
  return minSpread?.toString()
}

const useTobinTax = (askAsset?: CoinDenom) => {
  const { data: oracleParams } = useOracleParams()
  const tobinTax = oracleParams?.whitelist.find(
    ({ name }) => name === askAsset
  )?.tobin_tax

  return tobinTax?.toString()
}
