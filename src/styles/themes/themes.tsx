import { ReactNode } from "react"
import { toAmount } from "@web4/hubble-utils"

/* animation */
import AnimationLight from "./Light/Broadcasting.png"
import AnimationDark from "./Dark/Broadcasting.png"
import AnimationBlossom from "./Blossom/Broadcasting.png"
import AnimationMoon from "./Moon/Broadcasting.png"
import AnimationWhale from "./Whale/Broadcasting.png"
import AnimationMadness from "./Madness/Broadcasting.png"

/* favicon */
import FaviconLight from "./Light/favicon.svg"
import FaviconDark from "./Dark/favicon.svg"
import FaviconBlossom from "./Blossom/favicon.svg"
import FaviconMoon from "./Moon/favicon.svg"
import FaviconWhale from "./Whale/favicon.svg"
import FaviconMadness from "./Madness/favicon.svg"

/* preview */
import { ReactComponent as PreviewLight } from "./Light/preview.svg"
import { ReactComponent as PreviewDark } from "./Dark/preview.svg"
import { ReactComponent as PreviewBlossom } from "./Blossom/preview.svg"
import { ReactComponent as PreviewMoon } from "./Moon/preview.svg"
import { ReactComponent as PreviewWhale } from "./Whale/preview.svg"
import { ReactComponent as PreviewMadness } from "./Madness/preview.svg"

export interface Theme {
  name: string
  unlock: Amount
  animation: string
  favicon: string
  preview: ReactNode
}

export const themes: Theme[] = [
  {
    name: "light",
    unlock: toAmount("0"),
    animation: AnimationLight,
    favicon: FaviconLight,
    preview: <PreviewLight />,
  },
  {
    name: "dark",
    unlock: toAmount("0"),
    animation: AnimationDark,
    favicon: FaviconDark,
    preview: <PreviewDark />,
  },
  {
    name: "blossom",
    unlock: toAmount("1"),
    animation: AnimationBlossom,
    favicon: FaviconBlossom,
    preview: <PreviewBlossom />,
  },
  {
    name: "moon",
    unlock: toAmount("10"),
    animation: AnimationMoon,
    favicon: FaviconMoon,
    preview: <PreviewMoon />,
  },
  {
    name: "whale",
    unlock: toAmount("100"),
    animation: AnimationWhale,
    favicon: FaviconWhale,
    preview: <PreviewWhale />,
  },
  {
    name: "madness",
    unlock: toAmount("1000"),
    animation: AnimationMadness,
    favicon: FaviconMadness,
    preview: <PreviewMadness />,
  },
]

export default themes
