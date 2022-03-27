import { useTranslation } from "react-i18next"
import { useCurrency } from "data/settings/Currency"
import { useMemoizedPrices } from "data/queries/oracle"
import { Card } from "components/layout"
import { Read } from "components/token"
import { ModalButton } from "components/feedback"
import BiqPriceChart from "../charts/BiqPriceChart"
import DashboardContent from "./components/DashboardContent"
import styles from "./Dashboard.module.scss"

const BiqPrice = () => {
  const { t } = useTranslation()
  const currency = useCurrency()
  const denom = currency === "ubiq" ? "uusd" : currency
  const { data: prices, ...state } = useMemoizedPrices(denom)

  const render = () => {
    if (!prices) return
    const { ubiq: price } = prices
    return (
      <DashboardContent
        value={<Read amount={String(price)} denom={denom} decimals={0} auto />}
        footer={
          <ModalButton
            title={t("Biq price")}
            renderButton={(open) => (
              <button onClick={open}>{t("Show chart")}</button>
            )}
          >
            <BiqPriceChart />
          </ModalButton>
        }
      />
    )
  }

  return (
    <Card
      {...state}
      title={t("Biq price")}
      className={styles.price}
      size="small"
    >
      {render()}
    </Card>
  )
}

export default BiqPrice
