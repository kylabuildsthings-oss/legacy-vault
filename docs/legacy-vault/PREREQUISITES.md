# Prerequisites

## Installed for Step 1 (UI scaffold)

- **Node.js** — v18 LTS or newer recommended (v24 detected on this machine)
- **npm** — comes with Node

## Required for Step 2 (Daml ledger)

- **Daml SDK** — install via https://docs.daml.com/getting-started/index.html
  ```bash
  daml new legacy-vault-check --template create-daml-app  # verify install
  ```
- **Java 11+** — Daml Sandbox and JSON API require a JRE

## Optional (linkup_mcp — Step 7)

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
