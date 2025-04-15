#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
  ErrorCode,
  McpError,
  TextContent
} from '@modelcontextprotocol/sdk/types.js';
import { ResponseFormatter } from './formatter.js';
import {
  Config, ConfigSchema,
  GetBalanceSchema, TransferTokensSchema,
  MonadError
} from './types.js';
import { MonadClient } from './monad-client.js';
import dotenv from 'dotenv';

export class MonadServer {
  private server: Server;
  private client: MonadClient;

  constructor(config: Config) {
    // Validate config
    const result = ConfigSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Invalid configuration: ${result.error.message}`);
    }

    this.client = new MonadClient(config.privateKey, config.monadRpcUrl);
    this.server = new Server({
      name: 'monad-mcp',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Error handler
    this.server.onerror = (error: unknown) => {
      console.error('[MCP Error]:', error);
    };

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.error('Shutting down server...');
      await this.server.close();
      process.exit(0);
    });

    // Register tool handlers
    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_balance',
          description: 'Get the balance of a Monad wallet address',
          inputSchema: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                description: 'Ethereum address to check balance for. If omitted, uses your wallet address.'
              }
            }
          }
        } as Tool,
        {
          name: 'transfer_tokens',
          description: 'Transfer tokens to another address on Monad',
          inputSchema: {
            type: 'object',
            properties: {
              to: {
                type: 'string',
                description: 'Recipient Ethereum address'
              },
              amount: {
                type: 'string',
                description: 'Amount to transfer in ETH'
              }
            },
            required: ['to', 'amount']
          }
        } as Tool
      ]
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;
      console.error(`Tool called: ${name}`, args);

      try {
        switch (name) {
          case 'get_balance':
            return await this.handleGetBalance(args);
          case 'transfer_tokens':
            return await this.handleTransferTokens(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        return this.handleError(error);
      }
    });
  }

  private async handleGetBalance(args: unknown) {
    const result = GetBalanceSchema.safeParse(args);
    if (!result.success) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${result.error.message}`
      );
    }

    try {
      const balanceResponse = await this.client.getBalance(result.data.address);

      return {
        content: [{
          type: 'text',
          text: ResponseFormatter.formatBalanceResponse(balanceResponse)
        }] as TextContent[]
      };
    } catch (error) {
      if (error instanceof MonadError) {
        throw error;
      }
      console.error('Error getting balance:', error);
      throw new MonadError(
        'Failed to get balance',
        'transaction_failed',
        500
      );
    }
  }

  private async handleTransferTokens(args: unknown) {
    const result = TransferTokensSchema.safeParse(args);
    if (!result.success) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${result.error.message}`
      );
    }

    try {
      const txResponse = await this.client.transferTokens(
        result.data.to,
        result.data.amount
      );

      return {
        content: [{
          type: 'text',
          text: ResponseFormatter.formatTransactionResponse(txResponse)
        }] as TextContent[]
      };
    } catch (error) {
      if (error instanceof MonadError) {
        throw error;
      }
      console.error('Error transferring tokens:', error);
      throw new MonadError(
        'Failed to transfer tokens',
        'transaction_failed',
        500
      );
    }
  }

  private handleError(error: unknown) {
    if (error instanceof McpError) {
      throw error;
    }

    if (error instanceof MonadError) {
      return {
        content: [{
          type: 'text',
          text: `Monad blockchain error: ${error.message}`,
          isError: true
        }] as TextContent[]
      };
    }

    console.error('Unexpected error:', error);
    throw new McpError(
      ErrorCode.InternalError,
      'An unexpected error occurred'
    );
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Monad MCP server running on stdio');
  }
}

// Start the server
dotenv.config();

const config = {
  privateKey: process.env.WALLET_PRIVATE_KEY!,
  monadRpcUrl: process.env.MONAD_RPC_URL || 'https://rpc.monad.xyz/'
};

const server = new MonadServer(config);
server.start().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});