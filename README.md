# Claude MCP Server for Google Gemini

A [Claude Model Context Protocol (MCP)] server that chats to Google's Gemini.

[Claude Model Context Protocol (MCP)]: https://www.claudemcp.com/

## Prerequisites

Set an environment variable containing a Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

## Usage (Claude Desktop)

To use with Claude Desktop:

1. Add the server config:

   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

   On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "mcp-gemini": {
         "command": "npx",
         "args": ["deno", "run", "--allow-read", "--allow-env", "--allow-net=generativelanguage.googleapis.com:443", "https://github.com/leighmcculloch/mcp-gemini/raw/refs/heads/main/mcp-gemini.ts"]
       }
     }
   }
   ```

2. Reopen Claude Desktop. 

## Usage (Claude Code)

1. Add the server config:

   ```
   claude mcp add \
     --transport stdio \
     --scope user \
     mcp-gemini \
     -- \
     npx deno run --allow-read --allow-env --allow-net=generativelanguage.googleapis.com:443 https://github.com/leighmcculloch/mcp-gemini/raw/refs/heads/main/mcp-gemini.ts
   ```

2. Reopen Claude Code.
