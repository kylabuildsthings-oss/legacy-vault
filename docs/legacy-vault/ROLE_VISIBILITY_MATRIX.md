# Role visibility matrix

| Role | Persona | Sees | Cannot see |
|------|---------|------|------------|
| **HNWI** | Sarah Mitchell | Own vaults, full assets, all heirs | Other clients' vaults |
| **Heir** | Alex Henderson | Vaults where beneficiary; own allocation only | Other heirs, full asset list |
| **Oracle** | Law firm | Assigned vaults; trigger/verify workflow | Asset details until release |
| **Trust Administrator** | Wealth manager | All vaults, global ledger, SOC, registry | — |

## Demo cast (mock data)

| Person | Role | Login |
|--------|------|-------|
| Sarah Mitchell | HNWI testator | `sarah.m` |
| Alex Henderson | Primary heir (Sarah's vaults) | `alex.h` |
| Maya Mitchell | Secondary heir (Sarah's vaults) | — |
| William Anderson | Separate client (unrelated) | — |
| Sam Anderson | Heir (William's vault) | — |

SOC and ledger tables include a **Client** column (testator name) for cross-client disambiguation.

See [CONTRACT_SPEC.md](./CONTRACT_SPEC.md) for the demo cast mapped to Daml parties and [ROLE_VISIBILITY_MATRIX.md](./ROLE_VISIBILITY_MATRIX.md) for the UX matrix.
