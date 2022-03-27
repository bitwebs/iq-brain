import { Validator } from "@web4/iq.js"
import { Contacts } from "./components"

export interface IqValidator extends Validator.Data {
  picture?: string
  contact?: Contacts
  miss_counter?: string
  voting_power?: string
  self?: string
  votes?: Vote[]
}

interface Vote {
  options: Option[]
  proposal_id: string
  title: string
}

interface Option {
  option: string
  weight: string
}
