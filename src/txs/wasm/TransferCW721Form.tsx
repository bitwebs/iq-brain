import { useCallback, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import PersonIcon from "@mui/icons-material/Person"
import { AccAddress } from "@web4/iq.js"
import { MsgExecuteContract } from "@web4/iq.js"
import { truncate } from "@web4/hubble-utils"
import { SAMPLE_ADDRESS } from "config/constants"
import { queryKey } from "data/query"
import { useAddress } from "data/wallet"
import { useBankBalance } from "data/queries/bank"
import { useIqnsAddress } from "data/external/iqns"
import { Auto, Card, InlineFlex } from "components/layout"
import { Form, FormItem, FormHelp, Input } from "components/form"
import NFTAssetItem from "pages/nft/NFTAssetItem"
import AddressBookList from "../AddressBook/AddressBookList"
import validate from "../validate"
import Tx, { getInitialGasDenom } from "../Tx"

interface TxValues {
  recipient?: string // AccAddress | IQNS
  address?: AccAddress // hidden input
  memo?: string
}

interface Props {
  contract: string
  id: string
}

const TransferCW721Form = ({ contract, id }: Props) => {
  const { t } = useTranslation()
  const connectedAddress = useAddress()
  const bankBalance = useBankBalance()

  /* tx context */
  const initialGasDenom = getInitialGasDenom(bankBalance)

  /* form */
  const form = useForm<TxValues>({ mode: "onChange" })
  const { register, trigger, watch, setValue, setError, handleSubmit } = form
  const { formState } = form
  const { errors } = formState
  const { recipient, memo } = watch()

  const onClickAddressBookItem = async ({ recipient, memo }: AddressBook) => {
    setValue("recipient", recipient)
    setValue("memo", memo)
    await trigger("recipient")
  }

  /* resolve recipient */
  const { data: resolvedAddress, ...iqnsState } = useIqnsAddress(recipient ?? "")
  useEffect(() => {
    if (!recipient) {
      setValue("address", undefined)
    } else if (AccAddress.validate(recipient)) {
      setValue("address", recipient)
    } else if (resolvedAddress) {
      setValue("address", resolvedAddress)
    } else {
      setValue("address", recipient)
    }
  }, [form, recipient, resolvedAddress, setValue])

  // validate(iqns): not found
  const invalid =
    recipient?.endsWith(".ust") && !iqnsState.isLoading && !resolvedAddress
      ? t("Address not found")
      : ""

  const disabled =
    invalid || (iqnsState.isLoading && t("Searching for address..."))

  useEffect(() => {
    if (invalid) setError("recipient", { type: "invalid", message: invalid })
  }, [invalid, setError])

  /* tx */
  const createTx = useCallback(
    ({ address, memo }: TxValues) => {
      if (!connectedAddress) return
      if (!(address && AccAddress.validate(address))) return

      const msgs = [
        new MsgExecuteContract(connectedAddress, contract, {
          transfer_nft: { recipient: address, token_id: id },
        }),
      ]

      return { msgs, memo }
    },
    [connectedAddress, contract, id]
  )

  /* fee */
  const estimationTxValues = useMemo(
    () => ({ address: connectedAddress }),
    [connectedAddress]
  )

  const tx = {
    initialGasDenom,
    estimationTxValues,
    createTx,
    disabled,
    onSuccess: { label: t("NFT"), path: "/nft" },
    queryKeys: [
      [
        queryKey.wasm.contractQuery,
        contract,
        { tokens: { owner: connectedAddress } },
      ],
    ],
  }

  const renderResolvedAddress = () => {
    if (!resolvedAddress) return null
    return (
      <InlineFlex gap={4} className="success">
        <PersonIcon fontSize="inherit" />
        {truncate(resolvedAddress)}
      </InlineFlex>
    )
  }

  return (
    <Auto
      columns={[
        <Card isFetching={iqnsState.isLoading}>
          <NFTAssetItem contract={contract} id={id} />

          <Tx {...tx}>
            {({ fee, submit }) => (
              <Form onSubmit={handleSubmit(submit.fn)}>
                <FormItem
                  label={t("Recipient")}
                  extra={renderResolvedAddress()}
                  error={errors.recipient?.message}
                >
                  <Input
                    {...register("recipient", {
                      validate: validate.recipient(),
                    })}
                    placeholder={SAMPLE_ADDRESS}
                    autoFocus
                  />

                  <input {...register("address")} readOnly hidden />
                </FormItem>

                <FormItem
                  label={`${t("Memo")} (${t("optional")})`}
                  error={errors.memo?.message}
                >
                  <Input
                    {...register("memo", {
                      validate: {
                        size: validate.size(256, "Memo"),
                        brackets: validate.memo(),
                      },
                    })}
                  />
                </FormItem>

                {fee.render()}

                {!memo && (
                  <FormHelp>
                    {t("Check if this transaction requires a memo")}
                  </FormHelp>
                )}

                {submit.button}
              </Form>
            )}
          </Tx>
        </Card>,
        <AddressBookList onClick={onClickAddressBookItem} />,
      ]}
    />
  )
}

export default TransferCW721Form
