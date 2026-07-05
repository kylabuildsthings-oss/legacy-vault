// Generated from Scripts/Fixtures.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as Vault from '../../Vault/module';

export declare type Vlt001Seed = {
  parties: Vlt001Parties;
  vault: damlTypes.ContractId<Vault.VaultAgreement>;
  oracleAssignment: damlTypes.ContractId<Vault.OracleAssignment>;
};

export declare const Vlt001Seed:
  damlTypes.Serializable<Vlt001Seed> & {
  }
;


export declare type Vlt001Parties = {
  testator: damlTypes.Party;
  heirAlex: damlTypes.Party;
  heirMaya: damlTypes.Party;
  oracle: damlTypes.Party;
  admin: damlTypes.Party;
};

export declare const Vlt001Parties:
  damlTypes.Serializable<Vlt001Parties> & {
  }
;

