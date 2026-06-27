# linkup_mcp — Legacy Vault local setup

The [`linkup_mcp/`](../../linkup_mcp/) folder is a **local-only** MCP + RAG server for Cursor IDE help during Legacy Vault development. It is **gitignored** from the [GitHub repo](https://github.com/kylabuildsthings-oss/legacy-vault) and is **not required** to run the UI.

## What the UI uses today

Nothing. `./scripts/dev-ui.sh` runs standalone mock data. The Archival Assistant sidebar is static placeholder copy until Step 7B.

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

## Step 7 timeline

| Phase | Effort | What |
|-------|--------|------|
| **7A — Cursor MCP** | ~1–2 hrs first time | uv + Ollama + MCP config + vault docs in `data/` |
| **7B — In-app help** | Half day+ | Wire Archival Assistant to RAG API |

7A is optional dev tooling. 7B changes the product UI.

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
