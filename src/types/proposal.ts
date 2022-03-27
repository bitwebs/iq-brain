import { Vote } from "@web4/iq.js"

export interface IqProposalItem {
  voter: string
  options: { option: Vote.Option; weight: string }[]
}
