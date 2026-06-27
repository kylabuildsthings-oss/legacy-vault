# Daml setup guide (Step 2 — backend)

Guide for the teammate implementing **Legacy Vault** smart contracts on **Daml** / **Canton Network**. The React UI runs standalone with mock data today; this doc gets you from zero to `daml start`.

**Related docs:** [ROLE_VISIBILITY_MATRIX.md](./ROLE_VISIBILITY_MATRIX.md) · [PREREQUISITES.md](./PREREQUISITES.md) · [legacy-vault/daml/README.md](../../legacy-vault/daml/README.md)

---

## What you are building

Daml contracts in [`legacy-vault/daml/`](../../legacy-vault/daml/) will encode **party-scoped visibility** matching the mock UI:

| Daml party (concept) | UI role | Visibility |
|----------------------|---------|------------|
| Testator | HNWI | Full vault structure |
| Heir | Beneficiary | Own allocation only |
| Oracle | Law firm | Trigger / release; no asset details until release |
| Trust administrator | Admin | Institutional oversight |

Target templates (not written yet): `Vault.daml`, optional `VaultAdmin.daml`.

The frontend will connect later via **JSON API** + generated **`daml.js`** — not wired in the repo yet.

---

## Prerequisites checklist

| Tool | Version | Required for |
|------|---------|--------------|
| **Java JDK** | 11+ (17 recommended) | Daml Sandbox, JSON API |
| **Daml SDK** | Latest from [get.daml.com](https://get.daml.com/) | Build & run contracts |
| **Node.js** | 18+ | UI (separate terminal) |

Run the repo checker (after Step 8 lands):

```bash
./scripts/setup-daml.sh
```

---

## 1 — Install Java (macOS)

macOS `/usr/bin/java` is often a **stub** that prints “Unable to locate a Java Runtime.” Daml needs a real JDK.

**Homebrew (recommended):**

```bash
brew install --cask temurin@17
```

**Verify:**

```bash
/usr/libexec/java_home -V
java -version
```

You should see **OpenJDK 17** (or 11+) and `java -version` must succeed.

If `java` still fails, add to `~/.zshrc` or `~/.bash_profile`:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
```

Then open a new terminal and run `java -version` again.

---

## 2 — Install Daml SDK

Official installer (macOS / Linux):

```bash
curl -sSL https://get.daml.com/ | sh
```

Follow the prompts. The installer adds `daml` to `~/.daml/bin`.

**Add to PATH** (if `daml` is not found):

```bash
export PATH="$HOME/.daml/bin:$PATH"
```

Add that line to your shell profile for persistence.

**Verify:**

```bash
daml version
```

Docs: [Daml installation](https://docs.daml.com/getting-started/install.html)

---

## 3 — Smoke test (fresh template)

Confirm SDK + Java work **outside** Legacy Vault first:

```bash
cd /tmp
daml new lv-check --template create-daml-app
cd lv-check
daml start
```

Expected:

- Sandbox starts on default ports
- Browser may open the Navigator / JSON API docs
- No Java or classpath errors in the terminal

Stop with `Ctrl+C`, then remove `/tmp/lv-check` if you like.

---

## 4 — Legacy Vault project layout

```text
LEGACYVAULT/
├── legacy-vault/
│   ├── daml/                 # ← Put Vault.daml here (Step 2)
│   └── ui/                   # React frontend (mock data today)
└── scripts/
    ├── dev-ui.sh             # Terminal 2: UI
    └── setup-daml.sh         # Checks java + daml on PATH
```

**Current state:** [`legacy-vault/daml/`](../../legacy-vault/daml/) is a placeholder README only. You can either:

1. **Option A — Initialize inside `legacy-vault/`**  
   Merge `create-daml-app` structure so `daml/` and `daml.yaml` live under `legacy-vault/`.

2. **Option B — New subproject**  
   `daml new legacy-vault/ledger --template create-daml-app` and merge sources into `daml/`.

Pick one approach with the team; Option A is simpler for `daml start` from `legacy-vault/`.

---

## 5 — Contract design hints (from mock UI)

Use the mock fixtures as the product spec until UI is wired to the ledger:

| Mock source | Daml concept |
|-------------|--------------|
| [`fixtures.ts`](../../legacy-vault/ui/src/lib/mock/fixtures.ts) | Vault records, assets, heirs |
| [`types.ts`](../../legacy-vault/ui/src/lib/mock/types.ts) | `ReleaseStatus`, tokenized asset fields |
| [`redactVault.ts`](../../legacy-vault/ui/src/lib/scope/redactVault.ts) | Who sees what (implement as contract choices / observers) |
| [`releaseWorkflow.ts`](../../legacy-vault/ui/src/lib/mock/releaseWorkflow.ts) | Oracle confirm → settlement (future on-ledger workflow) |

**Parties to model:**

- `Testator` — signatory on vault creation
- `Heir` — observer with allocation-only visibility
- `Oracle` — signatory on release confirmation
- `Administrator` — read-only oversight party (optional)

See [ROLE_VISIBILITY_MATRIX.md](./ROLE_VISIBILITY_MATRIX.md) for the demo cast (Sarah, Alex, Sterling oracle, etc.).

---

## 6 — Full-stack local dev (after contracts exist)

**Terminal 1 — Ledger:**

```bash
cd legacy-vault
daml start
```

Note the **JSON API** URL and **ledger ID** from the startup log (needed for UI integration).

**Terminal 2 — UI (mock until wired):**

```bash
./scripts/dev-ui.sh
```

Open http://localhost:5173 — demo logins in [README.md](../../README.md) (`vault` password).

---

## 7 — Wiring UI to Daml (later)

Not implemented yet. Typical path:

1. `daml codegen js` (or project template output) → `ui/daml.js` or npm package
2. Configure JSON API endpoint in UI env (e.g. `VITE_DAML_JSON_API`)
3. Replace [`fixtures.ts`](../../legacy-vault/ui/src/lib/mock/fixtures.ts) reads with ledger queries per role party
4. Map session user IDs (`sarah.m`, etc.) to allocated **party IDs** on the sandbox

Keep mock mode until party allocation and auth are defined.

---

## 8 — Canton Network context

Legacy Vault is a **Canton Network hackathon** project (Tracks 1–3). Contracts should eventually target Canton privacy and atomic settlement semantics. Local **Daml Sandbox** is the first dev step; Canton deployment is out of scope for this setup doc.

References:

- [Canton Network documentation](https://docs.canton.network/)
- [Daml documentation](https://docs.daml.com/)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `java: Unable to locate a Java Runtime` | Install Temurin 17; set `JAVA_HOME` |
| `daml: command not found` | Add `~/.daml/bin` to PATH |
| `daml start` port in use | Kill prior sandbox or change port in `daml.yaml` |
| UI shows mock data only | Expected until Step 2 UI integration |

---

## Quick verification

- [ ] `java -version` succeeds (JDK 11+)
- [ ] `daml version` succeeds
- [ ] `daml new lv-check --template create-daml-app && cd lv-check && daml start` runs
- [ ] You know where to add `Vault.daml` under `legacy-vault/daml/`

When ready, implement contracts and open a PR against [legacy-vault](https://github.com/kylabuildsthings-oss/legacy-vault).
