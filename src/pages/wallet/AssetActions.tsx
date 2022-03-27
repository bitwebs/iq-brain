import { useTranslation } from "react-i18next"
import { flatten, uniq } from "ramda"
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined"
import ShortcutOutlinedIcon from "@mui/icons-material/ShortcutOutlined"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { isDenomIqNative } from "@web4/brain-utils"
import { has } from "utils/num"
import { useIsWalletEmpty } from "data/queries/bank"
import { useCW20Pairs } from "data/Iq/IqAssets"
import { InternalButton, InternalLink } from "components/general"
import { ExtraActions } from "components/layout"
import { ModalButton } from "components/feedback"
import Buy from "./Buy"
import { Props } from "./Asset"

const AssetActions = ({ token, symbol, balance }: Props) => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()

  const { data: pairs } = useCW20Pairs()

  if (!pairs) return null

  const iqswapAvailableList = uniq(flatten(Object.values(pairs)))
  const getIsSwappableToken = (token: IqAddress) =>
    isDenomIqNative(token) ||
    iqswapAvailableList.find(({ assets }) => assets.includes(token))

  return (
    <ExtraActions>
      {(token === "ubiq" || token === "uusd") && (
        <ModalButton
          title={t("Buy {{symbol}}", { symbol })}
          renderButton={(open) => (
            <InternalButton
              icon={<MonetizationOnOutlinedIcon style={{ fontSize: 18 }} />}
              onClick={open}
            >
              {t("Buy")}
            </InternalButton>
          )}
          maxHeight={false}
        >
          <Buy token={token} />
        </ModalButton>
      )}

      <InternalLink
        icon={<ShortcutOutlinedIcon style={{ fontSize: 18 }} />}
        to={`/send?token=${token}`}
        disabled={isWalletEmpty || !has(balance)}
      >
        {t("Send")}
      </InternalLink>

      <InternalLink
        icon={<RestartAltIcon style={{ fontSize: 18 }} />}
        to="/swap"
        state={token}
        disabled={isWalletEmpty || !has(balance) || !getIsSwappableToken(token)}
      >
        {t("Swap")}
      </InternalLink>
    </ExtraActions>
  )
}

export default AssetActions
