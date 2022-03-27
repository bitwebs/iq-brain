import { useTranslation } from "react-i18next"
import { useValidator } from "data/queries/staking"
import { useIqValidator } from "data/Iq/IqAPI"
import { Col, Page, Auto } from "components/layout"
import { useGoBackOnError } from "app/routes"
import useAddressParams from "./useAddressParams"
import ValidatorCompact from "./ValidatorCompact"
import ValidatorSummary from "./ValidatorSummary"
import ValidatorCommission from "./ValidatorCommission"
import ValidatorVotes from "./ValidatorVotes"
import ValidatorAddresses from "./ValidatorAddresses"
import ValidatorActions from "./ValidatorActions"

const ValidatorDetails = () => {
  const { t } = useTranslation()
  const address = useAddressParams()
  const { data: validator, ...state } = useValidator(address)
  const { data: IqValidator } = useIqValidator(address)

  useGoBackOnError(state)

  const render = () => {
    if (!validator) return null

    return (
      <Auto
        columns={[
          <Col>
            <ValidatorCompact />

            {IqValidator && (
              <>
                <ValidatorSummary validator={IqValidator} />
                <ValidatorCommission validator={IqValidator} />
                <ValidatorVotes validator={IqValidator} />
              </>
            )}

            <ValidatorAddresses validator={validator} />
          </Col>,
          <ValidatorActions destination={validator.operator_address} />,
        ]}
      />
    )
  }

  return (
    <Page {...state} title={t("Validator details")}>
      {render()}
    </Page>
  )
}

export default ValidatorDetails
