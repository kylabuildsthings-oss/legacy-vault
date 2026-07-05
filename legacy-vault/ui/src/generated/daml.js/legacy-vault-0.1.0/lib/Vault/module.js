"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');

var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');


exports.SecurityEventRecord = Object.assign(
{},
{
  templateId: '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:SecurityEventRecord',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuer: damlTypes.Party.decoder, eventId: damlTypes.Text.decoder, vaultId: damlTypes.Text.decoder, eventType: damlTypes.Text.decoder, targetAsset: damlTypes.Text.decoder, integrityStatus: damlTypes.Text.decoder, viewers: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    issuer: damlTypes.Party.encode(__typed__.issuer),
    eventId: damlTypes.Text.encode(__typed__.eventId),
    vaultId: damlTypes.Text.encode(__typed__.vaultId),
    eventType: damlTypes.Text.encode(__typed__.eventType),
    targetAsset: damlTypes.Text.encode(__typed__.targetAsset),
    integrityStatus: damlTypes.Text.encode(__typed__.integrityStatus),
    viewers: damlTypes.List(damlTypes.Party).encode(__typed__.viewers),
  };
}
,
  Archive: {
    template: function () { return exports.SecurityEventRecord; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.SecurityEventRecord);



exports.LedgerEvent = Object.assign(
{},
{
  templateId: '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:LedgerEvent',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuer: damlTypes.Party.decoder, eventId: damlTypes.Text.decoder, vaultId: damlTypes.Text.decoder, vaultName: damlTypes.Text.decoder, action: damlTypes.Text.decoder, status: exports.VaultStatus.decoder, viewers: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    issuer: damlTypes.Party.encode(__typed__.issuer),
    eventId: damlTypes.Text.encode(__typed__.eventId),
    vaultId: damlTypes.Text.encode(__typed__.vaultId),
    vaultName: damlTypes.Text.encode(__typed__.vaultName),
    action: damlTypes.Text.encode(__typed__.action),
    status: exports.VaultStatus.encode(__typed__.status),
    viewers: damlTypes.List(damlTypes.Party).encode(__typed__.viewers),
  };
}
,
  Archive: {
    template: function () { return exports.LedgerEvent; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.LedgerEvent);



exports.SettlementRecord = Object.assign(
{},
{
  templateId: '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:SettlementRecord',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({vaultId: damlTypes.Text.decoder, vaultName: damlTypes.Text.decoder, beneficiary: damlTypes.Party.decoder, beneficiaryLabel: damlTypes.Text.decoder, payoutStatus: damlTypes.Text.decoder, confirmedBy: damlTypes.Party.decoder, testator: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    vaultId: damlTypes.Text.encode(__typed__.vaultId),
    vaultName: damlTypes.Text.encode(__typed__.vaultName),
    beneficiary: damlTypes.Party.encode(__typed__.beneficiary),
    beneficiaryLabel: damlTypes.Text.encode(__typed__.beneficiaryLabel),
    payoutStatus: damlTypes.Text.encode(__typed__.payoutStatus),
    confirmedBy: damlTypes.Party.encode(__typed__.confirmedBy),
    testator: damlTypes.Party.encode(__typed__.testator),
    admin: damlTypes.Party.encode(__typed__.admin),
  };
}
,
  Archive: {
    template: function () { return exports.SettlementRecord; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.SettlementRecord);



exports.ConfirmReleaseResult = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({oracleAssignment: damlTypes.ContractId(exports.OracleAssignment).decoder, settlement: damlTypes.ContractId(exports.SettlementRecord).decoder, releaseLedger: damlTypes.ContractId(exports.LedgerEvent).decoder, payoutLedger: damlTypes.ContractId(exports.LedgerEvent).decoder, releaseSecurity: damlTypes.ContractId(exports.SecurityEventRecord).decoder, settlementSecurity: damlTypes.ContractId(exports.SecurityEventRecord).decoder, }); }),
  encode: function (__typed__) {
  return {
    oracleAssignment: damlTypes.ContractId(exports.OracleAssignment).encode(__typed__.oracleAssignment),
    settlement: damlTypes.ContractId(exports.SettlementRecord).encode(__typed__.settlement),
    releaseLedger: damlTypes.ContractId(exports.LedgerEvent).encode(__typed__.releaseLedger),
    payoutLedger: damlTypes.ContractId(exports.LedgerEvent).encode(__typed__.payoutLedger),
    releaseSecurity: damlTypes.ContractId(exports.SecurityEventRecord).encode(__typed__.releaseSecurity),
    settlementSecurity: damlTypes.ContractId(exports.SecurityEventRecord).encode(__typed__.settlementSecurity),
  };
}
,
};



exports.ConfirmRelease = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({beneficiary: damlTypes.Party.decoder, beneficiaryLabel: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    beneficiary: damlTypes.Party.encode(__typed__.beneficiary),
    beneficiaryLabel: damlTypes.Text.encode(__typed__.beneficiaryLabel),
  };
}
,
};



exports.InitiateVerification = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.OracleAssignment = Object.assign(
{},
{
  templateId: '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:OracleAssignment',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({vaultId: damlTypes.Text.decoder, vaultName: damlTypes.Text.decoder, testator: damlTypes.Party.decoder, oracle: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, releaseStatus: exports.ReleaseStatus.decoder, }); }),
  encode: function (__typed__) {
  return {
    vaultId: damlTypes.Text.encode(__typed__.vaultId),
    vaultName: damlTypes.Text.encode(__typed__.vaultName),
    testator: damlTypes.Party.encode(__typed__.testator),
    oracle: damlTypes.Party.encode(__typed__.oracle),
    admin: damlTypes.Party.encode(__typed__.admin),
    releaseStatus: exports.ReleaseStatus.encode(__typed__.releaseStatus),
  };
}
,
  Archive: {
    template: function () { return exports.OracleAssignment; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ConfirmRelease: {
    template: function () { return exports.OracleAssignment; },
    choiceName: 'ConfirmRelease',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ConfirmRelease.decoder; }),
    argumentEncode: function (__typed__) { return exports.ConfirmRelease.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.ConfirmReleaseResult.decoder; }),
    resultEncode: function (__typed__) { return exports.ConfirmReleaseResult.encode(__typed__); },
  },
  InitiateVerification: {
    template: function () { return exports.OracleAssignment; },
    choiceName: 'InitiateVerification',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.InitiateVerification.decoder; }),
    argumentEncode: function (__typed__) { return exports.InitiateVerification.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.OracleAssignment).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.OracleAssignment).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.OracleAssignment);



exports.HeirAllocation = Object.assign(
{},
{
  templateId: '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:HeirAllocation',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({vaultId: damlTypes.Text.decoder, vaultName: damlTypes.Text.decoder, heir: damlTypes.Party.decoder, allocationLabel: damlTypes.Text.decoder, assetIds: damlTypes.List(damlTypes.Text).decoder, testator: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    vaultId: damlTypes.Text.encode(__typed__.vaultId),
    vaultName: damlTypes.Text.encode(__typed__.vaultName),
    heir: damlTypes.Party.encode(__typed__.heir),
    allocationLabel: damlTypes.Text.encode(__typed__.allocationLabel),
    assetIds: damlTypes.List(damlTypes.Text).encode(__typed__.assetIds),
    testator: damlTypes.Party.encode(__typed__.testator),
    admin: damlTypes.Party.encode(__typed__.admin),
  };
}
,
  Archive: {
    template: function () { return exports.HeirAllocation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.HeirAllocation);



exports.TokenizedAsset = Object.assign(
{},
{
  templateId: '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:TokenizedAsset',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetId: damlTypes.Text.decoder, vaultId: damlTypes.Text.decoder, name: damlTypes.Text.decoder, tokenId: damlTypes.Text.decoder, assetClass: exports.AssetClass.decoder, settlementStatus: exports.SettlementStatus.decoder, intendedHeir: damlTypes.Party.decoder, status: exports.VaultStatus.decoder, testator: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    assetId: damlTypes.Text.encode(__typed__.assetId),
    vaultId: damlTypes.Text.encode(__typed__.vaultId),
    name: damlTypes.Text.encode(__typed__.name),
    tokenId: damlTypes.Text.encode(__typed__.tokenId),
    assetClass: exports.AssetClass.encode(__typed__.assetClass),
    settlementStatus: exports.SettlementStatus.encode(__typed__.settlementStatus),
    intendedHeir: damlTypes.Party.encode(__typed__.intendedHeir),
    status: exports.VaultStatus.encode(__typed__.status),
    testator: damlTypes.Party.encode(__typed__.testator),
    admin: damlTypes.Party.encode(__typed__.admin),
  };
}
,
  Archive: {
    template: function () { return exports.TokenizedAsset; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TokenizedAsset);



exports.ArchiveVault = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RegisterAsset = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetId: damlTypes.Text.decoder, assetName: damlTypes.Text.decoder, tokenId: damlTypes.Text.decoder, assetClass: exports.AssetClass.decoder, settlementStatus: exports.SettlementStatus.decoder, intendedHeir: damlTypes.Party.decoder, assetStatus: exports.VaultStatus.decoder, }); }),
  encode: function (__typed__) {
  return {
    assetId: damlTypes.Text.encode(__typed__.assetId),
    assetName: damlTypes.Text.encode(__typed__.assetName),
    tokenId: damlTypes.Text.encode(__typed__.tokenId),
    assetClass: exports.AssetClass.encode(__typed__.assetClass),
    settlementStatus: exports.SettlementStatus.encode(__typed__.settlementStatus),
    intendedHeir: damlTypes.Party.encode(__typed__.intendedHeir),
    assetStatus: exports.VaultStatus.encode(__typed__.assetStatus),
  };
}
,
};



exports.AddHeir = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({heir: damlTypes.Party.decoder, allocationLabel: damlTypes.Text.decoder, assetIds: damlTypes.List(damlTypes.Text).decoder, }); }),
  encode: function (__typed__) {
  return {
    heir: damlTypes.Party.encode(__typed__.heir),
    allocationLabel: damlTypes.Text.encode(__typed__.allocationLabel),
    assetIds: damlTypes.List(damlTypes.Text).encode(__typed__.assetIds),
  };
}
,
};



exports.VaultAgreement = Object.assign(
{},
{
  templateId: '715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3:Vault:VaultAgreement',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({vaultId: damlTypes.Text.decoder, name: damlTypes.Text.decoder, jurisdiction: damlTypes.Text.decoder, totalValueNumeric: damlTypes.Numeric(10).decoder, lastAccessed: damlTypes.Text.decoder, status: exports.VaultStatus.decoder, testator: damlTypes.Party.decoder, oracle: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    vaultId: damlTypes.Text.encode(__typed__.vaultId),
    name: damlTypes.Text.encode(__typed__.name),
    jurisdiction: damlTypes.Text.encode(__typed__.jurisdiction),
    totalValueNumeric: damlTypes.Numeric(10).encode(__typed__.totalValueNumeric),
    lastAccessed: damlTypes.Text.encode(__typed__.lastAccessed),
    status: exports.VaultStatus.encode(__typed__.status),
    testator: damlTypes.Party.encode(__typed__.testator),
    oracle: damlTypes.Party.encode(__typed__.oracle),
    admin: damlTypes.Party.encode(__typed__.admin),
  };
}
,
  Archive: {
    template: function () { return exports.VaultAgreement; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ArchiveVault: {
    template: function () { return exports.VaultAgreement; },
    choiceName: 'ArchiveVault',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ArchiveVault.decoder; }),
    argumentEncode: function (__typed__) { return exports.ArchiveVault.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.VaultAgreement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.VaultAgreement).encode(__typed__); },
  },
  AddHeir: {
    template: function () { return exports.VaultAgreement; },
    choiceName: 'AddHeir',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddHeir.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddHeir.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.HeirAllocation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.HeirAllocation).encode(__typed__); },
  },
  RegisterAsset: {
    template: function () { return exports.VaultAgreement; },
    choiceName: 'RegisterAsset',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RegisterAsset.decoder; }),
    argumentEncode: function (__typed__) { return exports.RegisterAsset.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenizedAsset).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenizedAsset).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.VaultAgreement);



exports.VaultStatus = {
  Active: 'Active',
  Verified: 'Verified',
  Archived: 'Archived',
  Pending: 'Pending',
  keys: ['Active','Verified','Archived','Pending',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.VaultStatus.Active), jtv.constant(exports.VaultStatus.Verified), jtv.constant(exports.VaultStatus.Archived), jtv.constant(exports.VaultStatus.Pending)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.ReleaseStatus = {
  Idle: 'Idle',
  PendingVerification: 'PendingVerification',
  ReleaseTriggered: 'ReleaseTriggered',
  keys: ['Idle','PendingVerification','ReleaseTriggered',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.ReleaseStatus.Idle), jtv.constant(exports.ReleaseStatus.PendingVerification), jtv.constant(exports.ReleaseStatus.ReleaseTriggered)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.SettlementStatus = {
  Registered: 'Registered',
  PendingRelease: 'PendingRelease',
  Settled: 'Settled',
  keys: ['Registered','PendingRelease','Settled',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.SettlementStatus.Registered), jtv.constant(exports.SettlementStatus.PendingRelease), jtv.constant(exports.SettlementStatus.Settled)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.AssetClass = {
  RWA: 'RWA',
  NFT: 'NFT',
  Security: 'Security',
  keys: ['RWA','NFT','Security',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.AssetClass.RWA), jtv.constant(exports.AssetClass.NFT), jtv.constant(exports.AssetClass.Security)); }),
  encode: function (__typed__) { return __typed__; },
};

