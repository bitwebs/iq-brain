import { useState } from "react"
import { useTranslation } from "react-i18next"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import GroupsIcon from "@mui/icons-material/Groups"
import QrCodeIcon from "@mui/icons-material/QrCode"
import { truncate } from "@web4/hubble-utils"
import { useWallet } from "@web4/wallet-provider"
import { useAddress } from "data/wallet"
import { useIqnsName } from "data/external/iqns"
import { Button, Copy, FinderLink } from "components/general"
import CopyStyles from "components/general/Copy.module.scss"
import { Flex, Grid } from "components/layout"
import { Tooltip, Popover } from "components/display"
import { isWallet, useAuth } from "auth"
import SwitchWallet from "auth/modules/select/SwitchWallet"
import PopoverNone from "../components/PopoverNone"
import WalletQR from "./WalletQR"
import styles from "./Connected.module.scss"

const Connected = () => {
  const { t } = useTranslation()
  const { disconnect } = useWallet()
  const address = useAddress()
  const { wallet } = useAuth()
  const { data: name } = useIqnsName(address ?? "")

  /* hack to close popover */
  const [key, setKey] = useState(0)
  const closePopover = () => setKey((key) => key + 1)

  if (!address) return null

  const footer = wallet
    ? { to: "/auth", onClick: closePopover, children: t("Manage wallets") }
    : { onClick: disconnect, children: t("Disconnect") }

  return (
    <Popover
      key={key}
      content={
        <PopoverNone className={styles.popover} footer={footer}>
          <Grid gap={16}>
            <Grid gap={4}>
              <section>
                <Tooltip content={t("View on Iq Explorer")}>
                  <FinderLink className={styles.link} short>
                    {address}
                  </FinderLink>
                </Tooltip>
              </section>

              <Flex gap={4} start>
                <Copy text={address} />
                <WalletQR
                  renderButton={(open) => (
                    <button className={CopyStyles.button} onClick={open}>
                      <QrCodeIcon fontSize="inherit" />
                    </button>
                  )}
                />
              </Flex>
            </Grid>

            <SwitchWallet />
          </Grid>
        </PopoverNone>
      }
      placement="bottom-end"
      theme="none"
    >
      <Button
        icon={
          isWallet.multisig(wallet) ? (
            <GroupsIcon style={{ fontSize: 16 }} />
          ) : (
            <AccountBalanceWalletIcon style={{ fontSize: 16 }} />
          )
        }
        size="small"
        outline
      >
        {isWallet.local(wallet) ? wallet.name : truncate(name ?? address)}
      </Button>
    </Popover>
  )
}

export default Connected
