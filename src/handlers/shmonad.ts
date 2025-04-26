import { Tool, ErrorCode, McpError, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { MonadClient } from '../monad-client.js';
import { ResponseFormatter } from '../formatter.js';
import { z } from 'zod';

// Zod schemas for input validation
export const StakeSchema = z.object({
    amount: z.number().positive('Amount must be positive')
});

export const UnstakeSchema = z.object({
    shares: z.number().positive('Shares must be positive')
});

// Tool definitions
export const shmonadTools: Tool[] = [
    {
        name: 'stake',
        description: 'Stake native tokens (MON) in the Shmonad staking contract',
        inputSchema: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number',
                    description: 'Amount of MON to stake'
                }
            },
            required: ['amount']
        }
    },
    {
        name: 'unstake',
        description: 'Unstake tokens from the Shmonad staking contract',
        inputSchema: {
            type: 'object',
            properties: {
                shares: {
                    type: 'number',
                    description: 'Number of shares to unstake'
                }
            },
            required: ['shares']
        }
    }
];

export async function handleStake(client: MonadClient, args: unknown) {
    const result = StakeSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.stake(result.data.amount);

        return {
            content: [{
                type: 'text',
                text: `Staking transaction submitted\nTransaction Hash: ${response.txHash}\nStatus: ${response.status}\n${response.message}`
            }] as TextContent[]
        };
    } catch (error) {
        console.error('Error staking tokens:', error);
        throw new McpError(
            ErrorCode.InternalError,
            'Failed to stake tokens'
        );
    }
}

export async function handleUnstake(client: MonadClient, args: unknown) {
    const result = UnstakeSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.unstake(result.data.shares);

        return {
            content: [{
                type: 'text',
                text: `Unstaking transaction submitted\nTransaction Hash: ${response.txHash}\nStatus: ${response.status}\n${response.message}`
            }] as TextContent[]
        };
    } catch (error) {
        console.error('Error unstaking tokens:', error);
        throw new McpError(
            ErrorCode.InternalError,
            'Failed to unstake tokens'
        );
    }
} 