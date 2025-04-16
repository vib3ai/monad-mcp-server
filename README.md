# Monad MCP Server

This MCP server allows AI assistants to interact with the Monad blockchain, enabling balance checks and token transfers.

## Quick Start

1. Get your private key from your Monad wallet

2. Add this configuration to your AI assistant config file:

**Windows**:
1. Press `Windows + R` to open Run dialog
2. Type `%APPDATA%\Claude` and press Enter
3. Create or edit `claude_desktop_config.json` file
4. Open Command Prompt (cmd)
5. Type `echo %appdata%` and copy the output value
6. Paste the value into `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "monad-mcp-server": {
      "command": "npx",
      "args": ["-y", "@vib3ai/monad-mcp-server"],
      "env": {
        "APPDATA": "YOUR_APPDATA_PATH",
        "WALLET_PRIVATE_KEY": "YOUR_PRIVATE_KEY_HERE",
        "MONAD_RPC_URL": "https://testnet-rpc.monad.xyz/"
      }
    }
  }
}
```

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "monad-mcp-server": {
      "command": "npx",
      "args": ["-y", "@vib3ai/monad-mcp-server"],
      "env": {
        "WALLET_PRIVATE_KEY": "",
        "MONAD_RPC_URL": "https://testnet-rpc.monad.xyz/"
      }
    }
  }
}
```

3. Restart your AI assistant

That's it! Your AI assistant can now interact with Monad blockchain through two tools:

- `getBalance`: Check wallet balance
- `transferETH`: Transfer tokens to another address

## Example Usage

Try asking your AI assistant:
- "What's my wallet balance on Monad?"
- "Can you transfer 0.1 ETH to 0x1234567890123456789012345678901234567890?"

## Troubleshooting

Logs can be found at:
- **Windows**: `%APPDATA%\Claude\logs\mcp-server-monad.log`
- **macOS**: `~/Library/Logs/Claude/mcp-server-monad.log`

## Development

If you want to contribute or run from source:

1. Clone the repository:
```bash
git clone https://github.com/vib3ai/monad-mcp-server.git
cd monad-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your credentials:
```
WALLET_PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://rpc.monad.xyz/
```

4. Build:
```bash
npm run build
```

5. Run:
```bash
npm start
```

## License

MIT