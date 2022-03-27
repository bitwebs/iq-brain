import { useTranslation } from "react-i18next"
import DescriptionIcon from "@mui/icons-material/Description"
import { TUTORIAL } from "config/constants"
import { ExternalLink } from "components/general"
import { Contacts } from "components/layout"
import styles from "./Links.module.scss"

const community = {
  medium: "https://medium.com/iqchain",
  discord: "https://discord.gg/8uGSUQN7wV",
  telegram: "https://t.me/IqChain",
  twitter: "https://twitter.com/IqChain",
  github: "https://github.com/bitwebs",
}

const Links = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.links}>
      <div className={styles.tutorial}>
        <ExternalLink href={TUTORIAL} className={styles.link}>
          <DescriptionIcon style={{ fontSize: 18 }} />
          {t("Tutorial")}
        </ExternalLink>
      </div>

      <div className={styles.community}>
        <Contacts contacts={community} menu />
      </div>
    </div>
  )
}

export default Links
