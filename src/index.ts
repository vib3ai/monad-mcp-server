#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
  TextContent
} from '@modelcontextprotocol/sdk/types.js';
import { ResponseFormatter } from './formatter.js';
import {
  Config, ConfigSchema,
  MonadError
} from './types.js';
import { MonadClient } from './monad-client.js';
import { allTools, getHandler } from './handlers/index.js';
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
      tools: allTools
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;
      console.error(`Tool called: ${name}`, args);

      try {
        const handler = getHandler(name);

        if (!handler) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }

        return await handler(this.client, args);
      } catch (error) {
        return this.handleError(error);
      }
    });
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