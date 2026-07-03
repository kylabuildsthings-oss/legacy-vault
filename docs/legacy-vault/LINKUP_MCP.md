# linkup_mcp — Legacy Vault local setup

The [`linkup_mcp/`](../../linkup_mcp/) folder is a **local-only** MCP + RAG server for Cursor IDE help during Legacy Vault development. It is **gitignored** from the [GitHub repo](https://github.com/kylabuildsthings-oss/legacy-vault) and is **not required** to run the UI.

## What the UI uses today

Nothing from linkup_mcp. The in-app **Archival Assistant** calls the Legacy Vault backend (`POST /assistant/query`) and uses role-scoped Canton vault context. See [ASSISTANT.md](ASSISTANT.md).

## What was kept (local slim copy)

| Keep | Purpose |
|------|---------|
| `server.py` | Cursor MCP (`rag`, `rag_stitch`, optional `web_search`) |
| `rag.py`, `rag_runtime.py`, `rag_stitch_contract.py` | Local RAG over `data/` |
| `data/*.md` | Legacy Vault docs corpus |
| `tests/test_rag_stitch_contract.py` | Contract tests |
| `scripts/run-linkup-mcp-stdio.sh` | Launch helper |

## What was removed locally

Stitch HTTP bridge, face verification, Google OAuth, Hermes/Nami seeds, ElevenLabs toolkit, voice hotkey tools, standalone side apps, and related docs/scripts. These deletions are **local only** — your teammate's upstream fork is unchanged.

## Timeline

| Phase | Status | What |
|-------|--------|------|
| **Product assistant** | **Built** | Backend context assistant via `POST /assistant/query` — [ASSISTANT.md](ASSISTANT.md) |
| **Cursor MCP (optional)** | Local dev tooling | uv + Ollama + MCP config + vault docs in `data/` |
| **LLM/RAG provider (optional)** | Roadmap | Plug document RAG behind the same API boundary |

Cursor MCP is optional dev tooling. It does not power the product UI.

## Quick start (Step 7A)

1. Install uv, Ollama, and pull `llama3.2`
2. `cd linkup_mcp && uv sync`
3. Configure `~/.cursor/mcp.json` — see [PREREQUISITES.md](./PREREQUISITES.md)
4. Restart Cursor; ask: *"Use the rag tool: who is William Anderson?"*

## Verify

```bash
cd linkup_mcp && uv run python -m unittest tests.test_rag_stitch_contract -v
```

Legacy Vault UI (unchanged by slim-down):

```bash
./scripts/dev-ui.sh
```

See also [linkup_mcp/README.md](../../linkup_mcp/README.md) in the local clone.
