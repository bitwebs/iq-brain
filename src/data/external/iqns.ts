import { useQuery } from "react-query"
import { Buffer } from "buffer"
import keccak256 from "keccak256"
import { queryKey, RefetchOptions } from "../query"
import { useLCDClient } from "../queries/lcdClient"
import { useIqContracts } from "../Iq/IqAssets"

/**
 * Resolve iq address from a domain name.
 *
 * @param name - A IQNS identifier such as "alice.ust"
 * @returns The iq address of the specified name, null if not resolvable
 */
export const useIqnsAddress = (name: string) => {
  const lcd = useLCDClient()
  const { data: contracts } = useIqContracts()

  return useQuery(
    [queryKey.IQNS, name],
    async () => {
      if (!contracts) return

      const { iqnsRegistry: registry } = contracts

      /**
       * Get the resolver address of a given domain name.
       *
       * @param name - A IQNS identifier such as "alice.ust"
       * @returns The Resolver contract address of the specified name, null if the domain does not exist.
       *
       * @see https://docs.ens.domains/#ens-architecture for the role of Resolver Contract
       */
      const { resolver } = await lcd.wasm.contractQuery<{ resolver: string }>(
        registry,
        { get_record: { name } }
      )

      if (!resolver) return

      const { address } = await lcd.wasm.contractQuery<{ address: string }>(
        resolver,
        { get_iq_address: { node: node(name) } }
      )

      return address
    },
    { ...RefetchOptions.INFINITY, enabled: name.endsWith(".ust") }
  )
}

/**
 * Resolve IQNS name from a iq address.
 *
 * @param address - A iq address
 * @returns The IQNS name of the specified address, null if not resolvable
 */
export const useIqnsName = (address: string) => {
  const lcd = useLCDClient()
  const { data: contracts } = useIqContracts()

  return useQuery(
    [queryKey.IQNS, address],
    async () => {
      if (!contracts || !address) return

      const { iqnsReverseRecord: reverseRecord } = contracts

      const { name } = await lcd.wasm.contractQuery<{ name: string | null }>(
        reverseRecord,
        { get_name: { address } }
      )

      return name
    },
    { ...RefetchOptions.INFINITY, enabled: Boolean(contracts) }
  )
}

/**
 * Generate a unique hash for any valid domain name.
 *
 * @param name - A IQNS identifier such as "alice.ust"
 * @returns The result of namehash function in a {@link Buffer} form
 *
 * @see https://docs.ens.domains/contract-api-reference/name-processing#hashing-names
 * for ENS Terminology
 *
 * @see https://eips.ethereum.org/EIPS/eip-137#namehash-algorithm
 * for namehash algorithm specification proposed in EIP-137
 */
function namehash(name: string): Buffer {
  if (name) {
    const [label, remainder] = name.split(".")
    return keccak256(Buffer.concat([namehash(remainder), keccak256(label)]))
  }

  return Buffer.from("".padStart(64, "0"), "hex")
}

/**
 * Generate the output of the namehash function in a form of number array
 * which is supported by the contract query.
 *
 * @param name - A IQNS identifier such as "alice.ust"
 * @returns The result of namehash function in a number array format
 */
function node(name: string): number[] {
  return Array.from(Uint8Array.from(namehash(name)))
}
