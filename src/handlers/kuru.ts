import { Tool, ErrorCode, McpError, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { MonadClient } from '../monad-client.js';
import { ResponseFormatter } from '../formatter.js';
import { z } from 'zod';

// Zod schemas for input validation
export const GetPriceSchema = z.object({
    tokenInAddress: z.string().describe('Address of the input token'),
    tokenOutAddress: z.string().describe('Address of the output token'),
    amountToSwap: z.number().positive('Amount must be positive'),
    amountType: z.enum(['amountIn', 'amountOut']).optional().describe('Type of amount (amountIn or amountOut)')
});

export const SwapSchema = z.object({
    tokenInAddress: z.string().describe('Address of the input token'),
    tokenOutAddress: z.string().describe('Address of the output token'),
    amountToSwap: z.number().positive('Amount must be positive'),
    slippageTolerance: z.number().min(0).max(100).optional().describe('Slippage tolerance in percent (default: 0.5%)')
});

// Tool definitions
export const kuruTools: Tool[] = [
    // {
    //     name: 'getKuruPrice',
    //     description: 'Get the price for a token swap on Kuru DEX',
    //     inputSchema: {
    //         type: 'object',
    //         properties: {
    //             tokenInAddress: {
    //                 type: 'string',
    //                 description: 'Address of the input token'
    //             },
    //             tokenOutAddress: {
    //                 type: 'string',
    //                 description: 'Address of the output token'
    //             },
    //             amountToSwap: {
    //                 type: 'number',
    //                 description: 'Amount to swap'
    //             },
    //             amountType: {
    //                 type: 'string',
    //                 enum: ['amountIn', 'amountOut'],
    //                 description: 'Type of amount (default: amountIn)'
    //             }
    //         },
    //         required: ['tokenInAddress', 'tokenOutAddress', 'amountToSwap']
    //     }
    // },
    {
        name: 'swapOnKuru',
        description: 'Swap tokens on Kuru DEX',
        inputSchema: {
            type: 'object',
            properties: {
                tokenInAddress: {
                    type: 'string',
                    description: 'Address of the input token'
                },
                tokenOutAddress: {
                    type: 'string',
                    description: 'Address of the output token'
                },
                amountToSwap: {
                    type: 'number',
                    description: 'Amount to swap'
                },
                slippageTolerance: {
                    type: 'number',
                    description: 'Slippage tolerance in percent (default: 0.5%)'
                }
            },
            required: ['tokenInAddress', 'tokenOutAddress', 'amountToSwap']
        }
    }
];

export async function handleGetKuruPrice(client: MonadClient, args: unknown) {
    const result = GetPriceSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.getKuruPrice(
            result.data.tokenInAddress,
            result.data.tokenOutAddress,
            result.data.amountToSwap,
            result.data.amountType
        );

        // Format the route safely, handling case where it's not an array
        let routeDisplay = 'Not available';
        if (response.route) {
            if (Array.isArray(response.route)) {
                routeDisplay = response.route.join(' -> ');
            } else if (typeof response.route === 'string') {
                routeDisplay = response.route;
            } else {
                routeDisplay = JSON.stringify(response.route);
            }
        }

        return {
            content: [{
                type: 'text',
                text: `Price Information:\nEstimated output: ${response.output}\nPrice impact: ${response.priceImpact}%\nRoute: ${routeDisplay}`
            }] as TextContent[]
        };
    } catch (error) {
        console.error('Error getting price:', error);
        throw new McpError(
            ErrorCode.InternalError,
            'Failed to get price from Kuru DEX'
        );
    }
}

export async function handleSwapOnKuru(client: MonadClient, args: unknown) {
    const result = SwapSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.swapOnKuru(
            result.data.tokenInAddress,
            result.data.tokenOutAddress,
            result.data.amountToSwap,
            result.data.slippageTolerance
        );

        return {
            content: [{
                type: 'text',
                text: `Swap transaction submitted\nTransaction Hash: ${response.txHash}\nInput: ${response.amountIn} ${response.tokenIn}\nOutput: ${response.amountOut} ${response.tokenOut}`
            }] as TextContent[]
        };
    } catch (error) {
        console.error('Error swapping tokens:', error);
        throw new McpError(
            ErrorCode.InternalError,
            'Failed to swap tokens on Kuru DEX'
        );
    }
} 