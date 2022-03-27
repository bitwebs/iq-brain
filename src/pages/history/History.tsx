import { useTranslation } from "react-i18next"
import { useIsIqAPIAvailable } from "data/Iq/IqAPI"
import { Wrong } from "components/feedback"
import HistoryList from "./HistoryList"

const History = () => {
  const { t } = useTranslation()
  const available = useIsIqAPIAvailable()

  if (!available) return <Wrong>{t("History is not supported")}</Wrong>

  return <HistoryList />
}

export default History
