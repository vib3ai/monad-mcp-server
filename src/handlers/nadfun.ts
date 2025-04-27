import { Tool, ErrorCode, McpError, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { MonadClient } from '../monad-client.js';
import { ResponseFormatter } from '../formatter.js';
import { z } from 'zod';

// Zod schemas for input validation
export const CreateCurveSchema = z.object({
    name: z.string().min(1).describe('Name of the token'),
    symbol: z.string().min(1).describe('Symbol of the token'),
    description: z.string().min(1).describe('Description of the token'),
    imageUrl: z.string().url().describe('URL of the image for the token'),
    amountIn: z.string().min(1).describe('Amount of ETH to invest (e.g., "0.5")'),
    homePage: z.string().optional().describe('Optional home page URL'),
    twitter: z.string().optional().describe('Optional Twitter URL'),
    telegram: z.string().optional().describe('Optional Telegram URL')
});

// Tool definitions
export const nadfunTools: Tool[] = [
    {
        name: 'createCurveWithMetadata',
        description: 'Create a new meme token using nadfun protocol',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the token'
                },
                symbol: {
                    type: 'string',
                    description: 'Symbol of the token'
                },
                description: {
                    type: 'string',
                    description: 'Description of the token'
                },
                imageUrl: {
                    type: 'string',
                    description: 'URL of the image for the token'
                },
                amountIn: {
                    type: 'string',
                    description: 'Amount of ETH to invest (e.g., "0.5"). Minimum required amount is 0.5 ETH.'
                },
                homePage: {
                    type: 'string',
                    description: 'Optional home page URL'
                },
                twitter: {
                    type: 'string',
                    description: 'Optional Twitter URL'
                },
                telegram: {
                    type: 'string',
                    description: 'Optional Telegram URL'
                }
            },
            required: ['name', 'symbol', 'description', 'imageUrl', 'amountIn']
        }
    }
];

export async function handleCreateCurveWithMetadata(client: MonadClient, args: unknown) {
    const result = CreateCurveSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.createCurveWithMetadata(
            result.data.name,
            result.data.symbol,
            result.data.description,
            result.data.imageUrl,
            result.data.amountIn,
            result.data.homePage || undefined,
            result.data.twitter || undefined,
            result.data.telegram || undefined
        );

        return {
            content: [{
                type: 'text',
                text: `Meme token creation transaction submitted\nTransaction Hash: ${response.txHash}\nStatus: ${response.status}\nMessage: ${response.message}`
            }] as TextContent[]
        };
    } catch (error) {
        console.error('Error creating meme token:', error);
        throw new McpError(
            ErrorCode.InternalError,
            'Failed to create meme token'
        );
    }
} 