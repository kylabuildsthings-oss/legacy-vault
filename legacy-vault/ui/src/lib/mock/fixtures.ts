import type {
  AdminClient,
  LedgerEntry,
  SecurityEvent,
  VaultRecord,
} from '@/lib/mock/types'

export const MOCK_VAULTS: VaultRecord[] = [
  {
    id: 'VLT-001',
    name: 'My Will',
    jurisdiction: 'Geneva, CH',
    totalValue: '$1.24B',
    totalValueNumeric: 1_240_000_000,
    lastAccessed: '2024-05-21',
    status: 'verified',
    testatorId: 'sarah.m',
    testatorName: 'Sarah Mitchell',
    oracleId: 'oracle@lawfirm',
    heirs: [
      { id: 'alex.h', name: 'Alex Henderson', allocationLabel: 'Primary heir — 60%' },
      { id: 'heir.maya', name: 'Maya Mitchell', allocationLabel: 'Secondary heir — 40%' },
    ],
    assets: [
      {
        id: 'AST-7112',
        name: 'Family Home (NYC)',
        intendedHeirId: 'alex.h',
        intendedHeirLabel: 'Alex Henderson',
        status: 'active',
      },
      {
        id: 'AST-3349',
        name: 'Investment Portfolio',
        intendedHeirId: 'heir.maya',
        intendedHeirLabel: 'Maya Mitchell',
        status: 'active',
      },
    ],
  },
  {
    id: 'VLT-002',
    name: 'Family Trust',
    jurisdiction: 'Zurich, CH',
    totalValue: '$842.1M',
    totalValueNumeric: 842_100_000,
    lastAccessed: '2024-05-22',
    status: 'archived',
    testatorId: 'sarah.m',
    testatorName: 'Sarah Mitchell',
    oracleId: 'oracle@lawfirm',
    heirs: [
      { id: 'alex.h', name: 'Alex Henderson', allocationLabel: 'Trust beneficiary — 50%' },
      { id: 'heir.maya', name: 'Maya Mitchell', allocationLabel: 'Trust beneficiary — 50%' },
    ],
    assets: [
      {
        id: 'AST-9001',
        name: 'Family Trust Funds',
        intendedHeirId: 'alex.h',
        intendedHeirLabel: 'Alex Henderson',
        status: 'archived',
      },
    ],
  },
  {
    id: 'VLT-003',
    name: 'Investment Portfolio',
    jurisdiction: 'London, UK',
    totalValue: '$2.15B',
    totalValueNumeric: 2_150_000_000,
    lastAccessed: '2024-05-20',
    status: 'active',
    testatorId: 'sarah.m',
    testatorName: 'Sarah Mitchell',
    oracleId: 'oracle@otherfirm',
    heirs: [
      { id: 'heir.maya', name: 'Maya Mitchell', allocationLabel: 'Sole beneficiary' },
    ],
    assets: [
      {
        id: 'AST-5520',
        name: 'Global Equity Holdings',
        intendedHeirId: 'heir.maya',
        intendedHeirLabel: 'Maya Mitchell',
        status: 'active',
      },
    ],
  },
  {
    id: 'VLT-004',
    name: 'Primary Estate Will',
    jurisdiction: 'New York, US',
    totalValue: '$3.1M',
    totalValueNumeric: 3_100_000,
    lastAccessed: '2024-05-18',
    status: 'active',
    testatorId: 'james.a',
    testatorName: 'William Anderson',
    oracleId: 'oracle@lawfirm',
    heirs: [{ id: 'heir.sam', name: 'Sam Anderson', allocationLabel: 'Sole heir' }],
    assets: [],
  },
]

export const MOCK_LEDGER: LedgerEntry[] = [
  {
    id: 'led-1',
    timestamp: '14:22:09 UTC',
    vaultId: 'VLT-001',
    vaultName: 'My Will',
    action: 'Biometric Authentication',
    status: 'verified',
    viewerIds: ['sarah.m', 'alex.h', 'admin@legacyvault'],
  },
  {
    id: 'led-2',
    timestamp: '11:05:41 UTC',
    vaultId: 'VLT-002',
    vaultName: 'Family Trust',
    action: 'Asset Revaluation',
    status: 'verified',
    viewerIds: ['sarah.m', 'alex.h', 'admin@legacyvault'],
  },
  {
    id: 'led-3',
    timestamp: '09:12:15 UTC',
    vaultId: 'VLT-001',
    vaultName: 'My Will',
    action: 'Heir Added',
    status: 'verified',
    viewerIds: ['sarah.m', 'admin@legacyvault'],
  },
  {
    id: 'led-4',
    timestamp: 'Yesterday, 18:30',
    vaultId: 'VLT-003',
    vaultName: 'Investment Portfolio',
    action: 'Account Sync',
    status: 'archived',
    viewerIds: ['sarah.m', 'admin@legacyvault'],
  },
  {
    id: 'led-5',
    timestamp: '10:00:00 UTC',
    vaultId: 'VLT-001',
    vaultName: 'My Will',
    action: 'Oracle Verification Pending',
    status: 'pending',
    viewerIds: ['oracle@lawfirm', 'admin@legacyvault'],
  },
]

export const MOCK_SECURITY: SecurityEvent[] = [
  {
    id: 'sec-1',
    timestamp: '14:22:09 UTC',
    eventType: 'Biometric Authentication',
    targetAsset: 'My Will',
    vaultId: 'VLT-001',
    integrityStatus: 'verified',
    viewerIds: ['sarah.m', 'alex.h', 'admin@legacyvault'],
  },
  {
    id: 'sec-2',
    timestamp: '11:05:41 UTC',
    eventType: 'Asset Revaluation',
    targetAsset: 'Family Trust',
    vaultId: 'VLT-002',
    integrityStatus: 'verified',
    viewerIds: ['sarah.m', 'admin@legacyvault'],
  },
  {
    id: 'sec-3',
    timestamp: '09:12:15 UTC',
    eventType: 'Heir Added',
    targetAsset: 'My Will',
    vaultId: 'VLT-001',
    integrityStatus: 'verified',
    viewerIds: ['sarah.m', 'admin@legacyvault'],
  },
  {
    id: 'sec-4',
    timestamp: '08:01:00 UTC',
    eventType: 'Oracle Check-in',
    targetAsset: 'My Will',
    vaultId: 'VLT-001',
    integrityStatus: 'verified',
    viewerIds: ['oracle@lawfirm', 'admin@legacyvault'],
  },
]

export const MOCK_ADMIN_CLIENTS: AdminClient[] = [
  {
    id: 'sarah.m',
    name: 'Sarah Mitchell',
    vaultCount: 3,
    totalAssets: '$4.238B',
    status: 'active',
  },
  {
    id: 'james.a',
    name: 'William Anderson',
    vaultCount: 1,
    totalAssets: '$842.1M',
    status: 'active',
  },
  {
    id: 'maria.g',
    name: 'Maria Gonzalez',
    vaultCount: 2,
    totalAssets: '$1.2B',
    status: 'active',
  },
]

export function formatAum(total: number): string {
  if (total >= 1_000_000_000) return `$${(total / 1_000_000_000).toFixed(3)}B`
  if (total >= 1_000_000) return `$${(total / 1_000_000).toFixed(1)}M`
  return `$${total.toLocaleString()}`
}
