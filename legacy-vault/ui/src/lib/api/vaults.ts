import { apiJson } from '@/lib/api/client'
import type { AssetClass } from '@/lib/mock/types'

export interface CreateVaultRequest {
  name: string
  jurisdiction: string
  oracleLedgerParty?: string
  heirs: Array<{
    name: string
    ledgerParty?: string
    allocationLabel?: string
  }>
  assets: Array<{
    name: string
    tokenId: string
    assetClass: AssetClass
    intendedHeirIndex?: number
  }>
}

export interface CreateVaultResponse {
  vaultId: string
  contracts: {
    vaultAgreement: string
    oracleAssignment: string
    heirAllocations: string[]
    tokenizedAssets: string[]
  }
}

export async function createVault(input: CreateVaultRequest): Promise<CreateVaultResponse> {
  const body = await apiJson<{ result: CreateVaultResponse }>('/vaults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  return body.result
}
