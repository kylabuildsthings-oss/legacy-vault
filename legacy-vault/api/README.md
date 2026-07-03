# Legacy Vault API

Backend API for the production Legacy Vault architecture.

The backend currently provides:

- Fastify API server
- Environment validation
- CORS for the local React UI
- `GET /health`
- Server-side Daml dev JWT signing
- Backend-issued demo session tokens with configurable expiry
- Protected `/vaults` and release-command routes
- Ledger-backed vault creation via `POST /vaults`
- Server-side party directory lookup / full party id resolution
- Diagnostic ledger routes that do not return raw tokens
- Optional Postgres persistence for product data
- Backend-powered Archival Assistant via `POST /assistant/query`

## Local development

```bash
cp legacy-vault/api/.env.example legacy-vault/api/.env
./scripts/dev-api.sh
```

Health check:

```bash
curl http://localhost:4000/health
```

## Postgres persistence

Postgres is optional for local ledger demos. To enable product persistence:

```bash
# Example local URL
DATABASE_URL=postgres://legacy_vault:legacy_vault@localhost:5432/legacy_vault

./scripts/db-migrate.sh
```

The initial schema creates:

- `organizations`
- `users`
- `vault_drafts`
- `document_metadata`
- `audit_events`
- `assistant_conversations`
- `assistant_messages`

Draft routes require a backend session token and `DATABASE_URL`:

```bash
curl http://localhost:4000/drafts \
  -H "Authorization: Bearer <session-token>"
```

Login:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"userId":"sarah.m","password":"vault"}'
```

Ledger party diagnostics:

```bash
curl http://localhost:4000/ledger/parties
curl http://localhost:4000/ledger/sessions/sarah.m/party
```

`/vaults` and release-command routes require `Authorization: Bearer <session-token>` from `/auth/login`.
Session tokens expire after `SESSION_TTL_SECONDS` (default: 8 hours).

Ask the Archival Assistant:

```bash
curl -X POST http://localhost:4000/assistant/query \
  -H "Authorization: Bearer <session-token>" \
  -H 'Content-Type: application/json' \
  -d '{"message":"What are my tokenized assets?","vaultId":"VLT-001"}'
```

Create a vault on Canton:

```bash
curl -X POST http://localhost:4000/vaults \
  -H "Authorization: Bearer <session-token>" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "New Family Vault",
    "jurisdiction": "Geneva, CH",
    "oracleLedgerParty": "Oracle_Sterling",
    "heirs": [{"name":"Alex Henderson","ledgerParty":"Heir_Alex"}],
    "assets": [{"name":"Primary Residence","tokenId":"NFT-1001","assetClass":"NFT"}]
  }'
```

These routes require the local Canton sandbox + JSON API to be running via `./scripts/dev-ledger.sh`.

## Tests

The fast backend suite covers auth/session behavior, route guards, assistant fallback, draft availability checks, and generic error handling without requiring Canton or Postgres:

```bash
npm test
npm run typecheck
```

See [PHASE8_HARDENING.md](../../docs/legacy-vault/PHASE8_HARDENING.md) for current coverage and remaining live-environment tests.

## Archival Assistant

`POST /assistant/query` answers questions using role-scoped Canton vault context. The current provider is a deterministic rule engine in `src/assistant/service.ts` — not an LLM.

See [ASSISTANT.md](../../docs/legacy-vault/ASSISTANT.md) for current behavior and [ASSISTANT_RAG_PLAN.md](../../docs/legacy-vault/ASSISTANT_RAG_PLAN.md) for the LLM/RAG follow-on design behind the same endpoint.

## Product direction

Daml JSON API access, party resolution, dev JWT signing, auth, vault creation, release commands, and the Archival Assistant now live in this backend. The React UI calls these endpoints instead of Canton directly in ledger mode.
