# Daml contracts (Step 2)

Placeholder for `Vault.daml` and optional `VaultAdmin.daml`.

**Backend setup:** [docs/legacy-vault/DAML_SETUP.md](../../docs/legacy-vault/DAML_SETUP.md)

**Readiness check:**

```bash
./scripts/setup-daml.sh
```

Contracts will encode party-scoped visibility: testator, heirs, oracle, trust administrator — see [ROLE_VISIBILITY_MATRIX.md](../../docs/legacy-vault/ROLE_VISIBILITY_MATRIX.md).

After installing the Daml SDK:

```bash
# Smoke test (outside this repo)
cd /tmp && daml new lv-check --template create-daml-app && cd lv-check && daml start

# Full-stack dev (once contracts exist)
cd legacy-vault && daml start   # terminal 1
./scripts/dev-ui.sh             # terminal 2 — from repo root
```
