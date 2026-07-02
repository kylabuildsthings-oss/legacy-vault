# Daml contracts (Step 2)

**Contract spec:** [docs/legacy-vault/CONTRACT_SPEC.md](../../docs/legacy-vault/CONTRACT_SPEC.md)

**Backend setup:** [docs/legacy-vault/DAML_SETUP.md](../../docs/legacy-vault/DAML_SETUP.md)

## Layout

```text
legacy-vault/
├── daml.yaml
├── daml/
│   ├── Vault.daml          # templates + choices
│   └── Scripts/
│       └── Setup.daml      # VLT-001 seed (init-script)
└── ui/
```

## Build

```bash
cd legacy-vault
daml build
```

Output: `.daml/dist/legacy-vault-0.1.0.dar`

## Run sandbox

From repo root:

```bash
./scripts/dev-ledger.sh    # terminal 1
./scripts/dev-ui.sh        # terminal 2
```

Or manually:

```bash
cd legacy-vault && daml start
```

**Readiness check:**

```bash
./scripts/setup-daml.sh
```

Templates implement party-scoped visibility per [CONTRACT_SPEC.md](../../docs/legacy-vault/CONTRACT_SPEC.md): `VaultAgreement`, `TokenizedAsset`, `HeirAllocation`, `OracleAssignment`, `SettlementRecord`, `LedgerEvent`, `SecurityEventRecord`.

Key choices: `InitiateVerification`, `ConfirmRelease` on `OracleAssignment`.
