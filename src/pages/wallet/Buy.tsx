import { useTranslation } from "react-i18next"
import qs from "qs"
import { readDenom } from "@web4/hubble-utils"
import { ReactComponent as Binance } from "styles/images/exchanges/Binance.svg"
import { ReactComponent as KuCoin } from "styles/images/exchanges/KuCoin.svg"
import { ReactComponent as Huobi } from "styles/images/exchanges/Huobi.svg"
import { ReactComponent as Bitfinex } from "styles/images/exchanges/Bitfinex.svg"
import Transak from "styles/images/exchanges/Transak.png"
import Kado from "styles/images/exchanges/Kado.svg"
import { ListGroup } from "components/display"

export const exchanges = {
  ubiq: [
    {
      children: "Binance",
      href: "https://www.binance.com/en/trade/BIQ_USDT",
      icon: <Binance width={24} height={24} />,
    },
    {
      children: "Huobi",
      href: "https://www.huobi.com/en-us/exchange/biq_usdt/",
      icon: <Huobi width={24} height={24} />,
    },
    {
      children: "KuCoin",
      href: "https://trade.kucoin.com/BIQ-USDT",
      icon: <KuCoin width={24} height={24} />,
    },
    {
      children: "Bitfinex",
      href: "https://trading.bitfinex.com/t/BIQ:USD",
      icon: <Bitfinex width={24} height={24} />,
    },
  ],
  uusd: [
    {
      children: "Binance",
      href: "https://www.binance.com/en/trade/UST_USDT",
      icon: <Binance width={24} height={24} />,
    },
    {
      children: "Huobi",
      href: "https://www.huobi.com/en-us/exchange/ust_usdt/",
      icon: <Huobi width={24} height={24} />,
    },
    {
      children: "KuCoin",
      href: "https://trade.kucoin.com/USDT-UST",
      icon: <KuCoin width={24} height={24} />,
    },
    {
      children: "Bitfinex",
      href: "https://trading.bitfinex.com/t/IQUST:USD",
      icon: <Bitfinex width={24} height={24} />,
    },
  ],
}

const TRANSAK_URL = "https://global.transak.com"
const TRANSAK_API_KEY = "f619d86d-48e0-4f2f-99a1-f827b719ac0b"
const KADO_URL = "https://ramp.kado.money"

const getTransakLink = (denom: "ubiq" | "uusd") => {
  const queryString = qs.stringify(
    {
      apiKey: TRANSAK_API_KEY,
      cryptoCurrencyList: "UST,BIQ",
      defaultCryptoCurrency: readDenom(denom).toUpperCase(),
      networks: "iq",
    },
    { skipNulls: true, encode: false }
  )

  return `${TRANSAK_URL}/?${queryString}`
}

const Buy = ({ token }: { token: "ubiq" | "uusd" }) => {
  const { t } = useTranslation()
  const TRANSAK = {
    children: "Transak",
    href: getTransakLink(token),
    icon: <img src={Transak} alt="" width={24} height={24} />,
  }

  const KADO = {
    children: "Kado Ramp",
    href: KADO_URL,
    icon: <img src={Kado} alt="Kado Ramp" width={24} height={24} />,
  }

  return (
    <ListGroup
      groups={[
        {
          title: t("Exchanges"),
          list: exchanges[token],
        },
        {
          title: t("Fiat"),
          list: token === "uusd" ? [TRANSAK, KADO] : [TRANSAK],
        },
      ]}
    />
  )
}

export default Buy
