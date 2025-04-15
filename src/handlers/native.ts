import { Tool, ErrorCode, McpError, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { MonadClient } from '../monad-client.js';
import { ResponseFormatter } from '../formatter.js';
import { GetBalanceSchema, GetBalanceArgs, TransferTokensSchema, MonadError } from '../types.js';

export const nativeTools: Tool[] = [
    {
        name: 'getBalance',
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
    },
    {
        name: 'transferETH',
        description: 'Transfer ETH to another address on Monad',
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
    }
];

export async function handleGetBalance(client: MonadClient, args: unknown) {
    const result = GetBalanceSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const balanceResponse = await client.getBalance(result.data.address);

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

export async function handleTransferETH(client: MonadClient, args: unknown) {
    const result = TransferTokensSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const txResponse = await client.transferETH(
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