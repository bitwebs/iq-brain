type IqAddress = string

type Amount = string
type Value = string | number
type Price = number

/* coin | token */
type CoinDenom = string // ubiq | uusd
type IBCDenom = string // ibc/...
type TokenAddress = IqAddress
type Denom = CoinDenom | IBCDenom
type Token = Denom | TokenAddress

/* asset info */
interface Asset {
  amount: Amount
  info: AssetInfo
}

type AssetInfo = AssetInfoNativeToken | AssetInfoCW20Token

interface AssetInfoNativeToken {
  native_token: { denom: Denom }
}

interface AssetInfoCW20Token {
  token: { contract_addr: IqAddress }
}

/* token item */
interface TokenItem {
  token: IqAddress
  decimals: number
  symbol: string
  name?: string
  icon?: string
}

interface TokenItemWithBalance extends TokenItem {
  balance: string
}

/* native */
interface CoinData {
  amount: Amount
  denom: Denom
}

/* ibc */
type IBCWhitelist = Record<string, IBCTokenItem>

interface IBCTokenInfoResponse {
  path: string
  base_denom: string
}

interface IBCTokenItem extends IBCTokenInfoResponse {
  denom: string
  symbol: string
  name: string
  icon: string
}

/* cw20 */
type CW20Contracts = Record<IqAddress, CW20ContractItem>
type CW20Whitelist = Record<IqAddress, CW20TokenItem>

interface CW20ContractItem {
  protocol: string
  name: string
  icon: string
}

interface CW20TokenInfoResponse {
  symbol: string
  name: string
  decimals: number
}

interface CW20TokenItem extends CW20TokenInfoResponse {
  token: IqAddress
  protocol?: string
  icon?: string
}

/* cw20: pair */
type CW20Pairs = Record<IqAddress, PairDetails>
type Dex = "iqswap" | "astroport"
type PairType = "xyk" | "stable"
interface PairDetails {
  dex: Dex
  type: PairType
  assets: Pair
}

type Pair = [Token, Token]

/* cw721 */
interface CW721ContractInfoResponse {
  name: string
  symbol: string
  decimals: number
}

interface CW721ContractItem extends CW721ContractInfoResponse {
  contract: IqAddress
  protocol?: string
  icon?: string
  homepage?: string
  marketplace?: string[]
}

type CW721Whitelist = Record<IqAddress, CW721ContractItem>

interface NFTTokenItem {
  token_uri?: string
  extension?: Extension
}

interface Extension {
  name?: string
  description?: string
  image?: string
}
