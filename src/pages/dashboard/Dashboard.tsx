import { useTranslation } from "react-i18next"
import { Col, Page } from "components/layout"
import BiqPrice from "./BiqPrice"
import Issuance from "./Issuance"
import CommunityPool from "./CommunityPool"
import StakingRatio from "./StakingRatio"
import Charts from "./Charts"
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Dashboard")}>
      <Col>
        <header className={styles.header}>
          <BiqPrice />
          <Issuance />
          <CommunityPool />
          <StakingRatio />
        </header>

        <Charts />
      </Col>
    </Page>
  )
}

export default Dashboard
