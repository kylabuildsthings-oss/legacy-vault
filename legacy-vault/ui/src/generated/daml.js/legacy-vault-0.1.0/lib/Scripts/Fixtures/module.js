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

var Vault = require('../../Vault/module');


exports.Vlt001Seed = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({parties: exports.Vlt001Parties.decoder, vault: damlTypes.ContractId(Vault.VaultAgreement).decoder, oracleAssignment: damlTypes.ContractId(Vault.OracleAssignment).decoder, }); }),
  encode: function (__typed__) {
  return {
    parties: exports.Vlt001Parties.encode(__typed__.parties),
    vault: damlTypes.ContractId(Vault.VaultAgreement).encode(__typed__.vault),
    oracleAssignment: damlTypes.ContractId(Vault.OracleAssignment).encode(__typed__.oracleAssignment),
  };
}
,
};



exports.Vlt001Parties = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({testator: damlTypes.Party.decoder, heirAlex: damlTypes.Party.decoder, heirMaya: damlTypes.Party.decoder, oracle: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    testator: damlTypes.Party.encode(__typed__.testator),
    heirAlex: damlTypes.Party.encode(__typed__.heirAlex),
    heirMaya: damlTypes.Party.encode(__typed__.heirMaya),
    oracle: damlTypes.Party.encode(__typed__.oracle),
    admin: damlTypes.Party.encode(__typed__.admin),
  };
}
,
};

