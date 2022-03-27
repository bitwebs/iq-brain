import { readPercent } from "@web4/brain-utils"

const Uptime = ({ children: value }: { children: number }) => {
  return <span>{readPercent(value, { fixed: 4 })}</span>
}

export default Uptime
