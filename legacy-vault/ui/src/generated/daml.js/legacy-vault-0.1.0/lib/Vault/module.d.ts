// Generated from Vault.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type SecurityEventRecord = {
  issuer: damlTypes.Party;
  eventId: string;
  vaultId: string;
  eventType: string;
  targetAsset: string;
  integrityStatus: string;
  viewers: damlTypes.Party[];
};

export declare interface SecurityEventRecordInterface {
  Archive: damlTypes.Choice<SecurityEventRecord, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
}
export declare const SecurityEventRecord:
  damlTypes.Template<SecurityEventRecord, undefined, '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:SecurityEventRecord'> & SecurityEventRecordInterface;

export declare namespace SecurityEventRecord {
  export type CreateEvent = damlLedger.CreateEvent<SecurityEventRecord, undefined, typeof SecurityEventRecord.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SecurityEventRecord, typeof SecurityEventRecord.templateId>
  export type Event = damlLedger.Event<SecurityEventRecord, undefined, typeof SecurityEventRecord.templateId>
  export type QueryResult = damlLedger.QueryResult<SecurityEventRecord, undefined, typeof SecurityEventRecord.templateId>
}



export declare type LedgerEvent = {
  issuer: damlTypes.Party;
  eventId: string;
  vaultId: string;
  vaultName: string;
  action: string;
  status: VaultStatus;
  viewers: damlTypes.Party[];
};

export declare interface LedgerEventInterface {
  Archive: damlTypes.Choice<LedgerEvent, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
}
export declare const LedgerEvent:
  damlTypes.Template<LedgerEvent, undefined, '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:LedgerEvent'> & LedgerEventInterface;

export declare namespace LedgerEvent {
  export type CreateEvent = damlLedger.CreateEvent<LedgerEvent, undefined, typeof LedgerEvent.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LedgerEvent, typeof LedgerEvent.templateId>
  export type Event = damlLedger.Event<LedgerEvent, undefined, typeof LedgerEvent.templateId>
  export type QueryResult = damlLedger.QueryResult<LedgerEvent, undefined, typeof LedgerEvent.templateId>
}



export declare type SettlementRecord = {
  vaultId: string;
  vaultName: string;
  beneficiary: damlTypes.Party;
  beneficiaryLabel: string;
  payoutStatus: string;
  confirmedBy: damlTypes.Party;
  testator: damlTypes.Party;
  admin: damlTypes.Party;
};

export declare interface SettlementRecordInterface {
  Archive: damlTypes.Choice<SettlementRecord, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
}
export declare const SettlementRecord:
  damlTypes.Template<SettlementRecord, undefined, '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:SettlementRecord'> & SettlementRecordInterface;

export declare namespace SettlementRecord {
  export type CreateEvent = damlLedger.CreateEvent<SettlementRecord, undefined, typeof SettlementRecord.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SettlementRecord, typeof SettlementRecord.templateId>
  export type Event = damlLedger.Event<SettlementRecord, undefined, typeof SettlementRecord.templateId>
  export type QueryResult = damlLedger.QueryResult<SettlementRecord, undefined, typeof SettlementRecord.templateId>
}



export declare type ConfirmReleaseResult = {
  oracleAssignment: damlTypes.ContractId<OracleAssignment>;
  settlement: damlTypes.ContractId<SettlementRecord>;
  releaseLedger: damlTypes.ContractId<LedgerEvent>;
  payoutLedger: damlTypes.ContractId<LedgerEvent>;
  releaseSecurity: damlTypes.ContractId<SecurityEventRecord>;
  settlementSecurity: damlTypes.ContractId<SecurityEventRecord>;
};

export declare const ConfirmReleaseResult:
  damlTypes.Serializable<ConfirmReleaseResult> & {
  }
;


export declare type ConfirmRelease = {
  beneficiary: damlTypes.Party;
  beneficiaryLabel: string;
};

export declare const ConfirmRelease:
  damlTypes.Serializable<ConfirmRelease> & {
  }
;


export declare type InitiateVerification = {
};

export declare const InitiateVerification:
  damlTypes.Serializable<InitiateVerification> & {
  }
;


export declare type OracleAssignment = {
  vaultId: string;
  vaultName: string;
  testator: damlTypes.Party;
  oracle: damlTypes.Party;
  admin: damlTypes.Party;
  releaseStatus: ReleaseStatus;
};

export declare interface OracleAssignmentInterface {
  Archive: damlTypes.Choice<OracleAssignment, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  ConfirmRelease: damlTypes.Choice<OracleAssignment, ConfirmRelease, ConfirmReleaseResult, undefined>;
  InitiateVerification: damlTypes.Choice<OracleAssignment, InitiateVerification, damlTypes.ContractId<OracleAssignment>, undefined>;
}
export declare const OracleAssignment:
  damlTypes.Template<OracleAssignment, undefined, '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:OracleAssignment'> & OracleAssignmentInterface;

export declare namespace OracleAssignment {
  export type CreateEvent = damlLedger.CreateEvent<OracleAssignment, undefined, typeof OracleAssignment.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<OracleAssignment, typeof OracleAssignment.templateId>
  export type Event = damlLedger.Event<OracleAssignment, undefined, typeof OracleAssignment.templateId>
  export type QueryResult = damlLedger.QueryResult<OracleAssignment, undefined, typeof OracleAssignment.templateId>
}



export declare type HeirAllocation = {
  vaultId: string;
  vaultName: string;
  heir: damlTypes.Party;
  allocationLabel: string;
  assetIds: string[];
  testator: damlTypes.Party;
  admin: damlTypes.Party;
};

export declare interface HeirAllocationInterface {
  Archive: damlTypes.Choice<HeirAllocation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
}
export declare const HeirAllocation:
  damlTypes.Template<HeirAllocation, undefined, '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:HeirAllocation'> & HeirAllocationInterface;

export declare namespace HeirAllocation {
  export type CreateEvent = damlLedger.CreateEvent<HeirAllocation, undefined, typeof HeirAllocation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<HeirAllocation, typeof HeirAllocation.templateId>
  export type Event = damlLedger.Event<HeirAllocation, undefined, typeof HeirAllocation.templateId>
  export type QueryResult = damlLedger.QueryResult<HeirAllocation, undefined, typeof HeirAllocation.templateId>
}



export declare type TokenizedAsset = {
  assetId: string;
  vaultId: string;
  name: string;
  tokenId: string;
  assetClass: AssetClass;
  settlementStatus: SettlementStatus;
  intendedHeir: damlTypes.Party;
  status: VaultStatus;
  testator: damlTypes.Party;
  admin: damlTypes.Party;
};

export declare interface TokenizedAssetInterface {
  Archive: damlTypes.Choice<TokenizedAsset, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
}
export declare const TokenizedAsset:
  damlTypes.Template<TokenizedAsset, undefined, '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:TokenizedAsset'> & TokenizedAssetInterface;

export declare namespace TokenizedAsset {
  export type CreateEvent = damlLedger.CreateEvent<TokenizedAsset, undefined, typeof TokenizedAsset.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TokenizedAsset, typeof TokenizedAsset.templateId>
  export type Event = damlLedger.Event<TokenizedAsset, undefined, typeof TokenizedAsset.templateId>
  export type QueryResult = damlLedger.QueryResult<TokenizedAsset, undefined, typeof TokenizedAsset.templateId>
}



export declare type ArchiveVault = {
};

export declare const ArchiveVault:
  damlTypes.Serializable<ArchiveVault> & {
  }
;


export declare type RegisterAsset = {
  assetId: string;
  assetName: string;
  tokenId: string;
  assetClass: AssetClass;
  settlementStatus: SettlementStatus;
  intendedHeir: damlTypes.Party;
  assetStatus: VaultStatus;
};

export declare const RegisterAsset:
  damlTypes.Serializable<RegisterAsset> & {
  }
;


export declare type AddHeir = {
  heir: damlTypes.Party;
  allocationLabel: string;
  assetIds: string[];
};

export declare const AddHeir:
  damlTypes.Serializable<AddHeir> & {
  }
;


export declare type VaultAgreement = {
  vaultId: string;
  name: string;
  jurisdiction: string;
  totalValueNumeric: damlTypes.Numeric;
  lastAccessed: string;
  status: VaultStatus;
  testator: damlTypes.Party;
  oracle: damlTypes.Party;
  admin: damlTypes.Party;
};

export declare interface VaultAgreementInterface {
  Archive: damlTypes.Choice<VaultAgreement, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  ArchiveVault: damlTypes.Choice<VaultAgreement, ArchiveVault, damlTypes.ContractId<VaultAgreement>, undefined>;
  AddHeir: damlTypes.Choice<VaultAgreement, AddHeir, damlTypes.ContractId<HeirAllocation>, undefined>;
  RegisterAsset: damlTypes.Choice<VaultAgreement, RegisterAsset, damlTypes.ContractId<TokenizedAsset>, undefined>;
}
export declare const VaultAgreement:
  damlTypes.Template<VaultAgreement, undefined, '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:VaultAgreement'> & VaultAgreementInterface;

export declare namespace VaultAgreement {
  export type CreateEvent = damlLedger.CreateEvent<VaultAgreement, undefined, typeof VaultAgreement.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<VaultAgreement, typeof VaultAgreement.templateId>
  export type Event = damlLedger.Event<VaultAgreement, undefined, typeof VaultAgreement.templateId>
  export type QueryResult = damlLedger.QueryResult<VaultAgreement, undefined, typeof VaultAgreement.templateId>
}



export declare type VaultStatus =
  | 'Active'
  | 'Verified'
  | 'Archived'
  | 'Pending'
;

export declare const VaultStatus:
  damlTypes.Serializable<VaultStatus> & {
  }
& { readonly keys: VaultStatus[] } & { readonly [e in VaultStatus]: e }
;


export declare type ReleaseStatus =
  | 'Idle'
  | 'PendingVerification'
  | 'ReleaseTriggered'
;

export declare const ReleaseStatus:
  damlTypes.Serializable<ReleaseStatus> & {
  }
& { readonly keys: ReleaseStatus[] } & { readonly [e in ReleaseStatus]: e }
;


export declare type SettlementStatus =
  | 'Registered'
  | 'PendingRelease'
  | 'Settled'
;

export declare const SettlementStatus:
  damlTypes.Serializable<SettlementStatus> & {
  }
& { readonly keys: SettlementStatus[] } & { readonly [e in SettlementStatus]: e }
;


export declare type AssetClass =
  | 'RWA'
  | 'NFT'
  | 'Security'
;

export declare const AssetClass:
  damlTypes.Serializable<AssetClass> & {
  }
& { readonly keys: AssetClass[] } & { readonly [e in AssetClass]: e }
;

