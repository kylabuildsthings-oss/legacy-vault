# Prerequisites

## Installed for Step 1 (UI scaffold)

- **Node.js** — v18 LTS or newer recommended (v24 detected on this machine)
- **npm** — comes with Node

## Required for Step 2 (Daml ledger)

See **[DAML_SETUP.md](./DAML_SETUP.md)** for the full backend onboarding guide (JDK, Daml SDK, smoke test, contract layout).

Quick check:

```bash
./scripts/setup-daml.sh
```

- **Daml SDK** — install via https://docs.daml.com/getting-started/install.html
  ```bash
  curl -sSL https://get.daml.com/ | sh
  daml version
  ```
- **Java 11+** — Daml Sandbox and JSON API require a **real JDK** (not the macOS `/usr/bin/java` stub)
  ```bash
  brew install --cask temurin@17
  java -version
  ```

## Optional (linkup_mcp — Step 7)

Local Cursor MCP + RAG for document Q&A while building Legacy Vault. **Not required to run the UI.** See [LINKUP_MCP.md](./LINKUP_MCP.md) for what was kept vs removed locally.

- **uv** — Python package manager: https://github.com/astral-sh/uv
- **Ollama** + `llama3.2` — local RAG for Cursor MCP
- **Linkup API key** — optional web search in MCP

## Cursor MCP config (after linkup_mcp clone)

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "linkup-server": {
      "command": "uv",
      "args": [
        "run",
        "--directory",
        "/Volumes/KYE SSD 2023/LEGACYVAULT/linkup_mcp",
        "python",
        "server.py"
      ]
    }
  }
}
```

If `uv` is not installed, use `pip install -e .` inside `linkup_mcp` and point MCP at your Python interpreter.
