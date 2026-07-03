# Archival Assistant

The **Archival Assistant** is the in-app help panel on vault screens. It answers questions using **role-scoped Canton vault context** fetched server-side — not a third-party agent framework.

## What is built today

| Layer | Behavior |
|-------|----------|
| UI (`ArchivalAssistant.tsx`) | Chat UI, suggested prompts, opening copy, **Initiate verification** action |
| API (`POST /assistant/query`) | Authenticated query endpoint |
| Provider (`assistant/service.ts`) | Deterministic rule engine over live ledger snapshot |
| Persistence (optional) | Conversation history when `DATABASE_URL` is configured |

Flow:

```text
React UI → POST /assistant/query → fetchLedgerSnapshotForSession()
                                 → answerFromContext() (rule engine)
                                 → citations + reply
```

User-submitted questions return answers grounded in the caller's visible vaults, heirs, assets, and release state. Citations reference Canton contract fields the user is allowed to see.

Opening messages in the UI are still scripted welcome copy. Only typed questions hit the backend.

## What is not built (roadmap)

- LLM or embedding-based RAG over uploaded wills and legal documents
- External search or document ingestion pipelines
- Streaming responses or multi-turn reasoning beyond stored conversation history

These are optional future enhancements behind the same API boundary. See [ASSISTANT_RAG_PLAN.md](ASSISTANT_RAG_PLAN.md) for the full follow-on design.

## Provider boundary

`POST /assistant/query` is the stable product contract. The backend loads auth + Canton context, then dispatches to a swappable provider:

| Provider | Env value | Status |
|----------|-----------|--------|
| Deterministic rule engine | `ASSISTANT_PROVIDER=deterministic` | **Built** (default) |
| Local RAG (Ollama) | `ASSISTANT_PROVIDER=local-rag` | Scaffold — falls back to deterministic |
| Hosted LLM | `ASSISTANT_PROVIDER=hosted-llm` | Scaffold — falls back to deterministic |

Implementation:

1. Authenticate session (`routes/assistant.ts`)
2. Load role-scoped ledger snapshot (`service.ts`)
3. `resolveAssistantProvider()` → `AssistantProvider.answer(context)`
4. Return `{ message, citations, conversationId? }`

```typescript
// legacy-vault/api/src/assistant/providers/types.ts
interface AssistantProvider {
  readonly id: 'deterministic' | 'local-rag' | 'hosted-llm'
  answer(context: AssistantProviderContext): Promise<AssistantQueryResult>
}
```

Auth, party resolution, and Canton reads stay in the service layer — providers only generate answers from pre-authorized context.

## Local development

Requires backend + Canton sandbox in ledger mode:

```bash
# Terminal 1
./scripts/dev-ledger.sh

# Terminal 2
./scripts/dev-api.sh

# Terminal 3 — VITE_USE_MOCK_LEDGER=false in legacy-vault/ui/.env.local
./scripts/dev-ui.sh
```

Example query:

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"userId":"sarah.m","password":"vault"}' | jq -r .token)

curl -X POST http://localhost:4000/assistant/query \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"message":"What are my tokenized assets?","vaultId":"VLT-001"}'
```

## Optional Cursor MCP (not the product assistant)

[LINKUP_MCP.md](LINKUP_MCP.md) describes an optional **local** MCP + RAG server for document Q&A while developing in Cursor. It is gitignored, not wired to the React UI, and not required to run Legacy Vault.
