import { MonadAgentKit, ACTIONS } from '@vib3ai/monad-agent-kit';
import { MonadError } from '../types.js';
import axios from 'axios';

export interface PriceResponse {
    output: string;
    priceImpact: number;
    route: string[] | string | any;
}

export interface SwapResponse {
    txHash: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOut: string;
}

/**
 * Get token info by address
 * @param tokenAddress Token address
 * @returns Token info with decimals
 */
async function getTokenInfo(tokenAddress: string): Promise<{ decimal: number }> {
    try {
        // API endpoint for token search (Kuru API)
        const apiUrl = 'https://api.kuru.io/api/v2/tokens/search';

        // Normalize address for comparison
        const normalizedAddress = tokenAddress.toLowerCase();

        // Fetch all tokens (limit=20 should cover most common tokens)
        const response = await axios.get(apiUrl, {
            params: {
                limit: 20
            }
        });

        if (response.data?.success && response.data?.data?.data) {
            // Find the token by address in the response
            const token = response.data.data.data.find(
                (t: any) => t.address.toLowerCase() === normalizedAddress
            );

            if (token) {
                return {
                    decimal: token.decimal
                };
            }
        }

        // Default decimals if token not found
        console.log(`Token not found for address ${tokenAddress}, using default decimals (18)`);
        return { decimal: 18 };
    } catch (error) {
        console.error('Error getting token info:', error);
        // Default to 18 decimals if there's an error
        return { decimal: 18 };
    }
}

/**
 * Get the price for a token swap on Kuru DEX
 * @param agent MonadAgentKit instance
 * @param tokenInAddress The address of the input token
 * @param tokenOutAddress The address of the output token
 * @param amountToSwap The amount to swap
 * @param amountType The type of amount (amountIn or amountOut)
 * @returns The price information
 */
export async function getPrice(
    agent: MonadAgentKit,
    tokenInAddress: string,
    tokenOutAddress: string,
    amountToSwap: number,
    amountType: 'amountIn' | 'amountOut' = 'amountIn'
): Promise<PriceResponse> {
    try {
        if (!tokenInAddress || !tokenOutAddress) {
            throw new MonadError(
                'Token addresses must be provided',
                'invalid_token_address',
                400
            );
        }

        if (typeof amountToSwap !== 'number' || amountToSwap <= 0) {
            throw new MonadError(
                'Amount must be a positive number',
                'invalid_amount',
                400
            );
        }

        const result = await ACTIONS.getPrice(
            agent,
            tokenInAddress,
            tokenOutAddress,
            amountToSwap,
            amountType
        );

        let route = result.route;
        if (!route) {
            route = [`${tokenInAddress}`, `${tokenOutAddress}`];
        }

        return {
            output: result.output?.toString() || '0',
            priceImpact: result.priceImpact || 0,
            route: route
        };
    } catch (error) {
        console.error('Error in getPrice:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to get price',
            'price_fetch_failed',
            500
        );
    }
}

/**
 * Swap tokens on Kuru DEX
 * @param agent MonadAgentKit instance
 * @param tokenInAddress The address of the input token
 * @param tokenOutAddress The address of the output token
 * @param amountToSwap The amount to swap
 * @param slippageTolerance The slippage tolerance in percent (default: 0.5%)
 * @returns The swap transaction details
 */
export async function swap(
    agent: MonadAgentKit,
    tokenInAddress: string,
    tokenOutAddress: string,
    amountToSwap: number,
    slippageTolerance: number = 0.5
): Promise<SwapResponse> {
    try {
        if (!tokenInAddress || !tokenOutAddress) {
            throw new MonadError(
                'Token addresses must be provided',
                'invalid_token_address',
                400
            );
        }

        if (typeof amountToSwap !== 'number' || amountToSwap <= 0) {
            throw new MonadError(
                'Amount must be a positive number',
                'invalid_amount',
                400
            );
        }

        // Get token info for decimals
        const tokenInInfo = await getTokenInfo(tokenInAddress);
        const tokenOutInfo = await getTokenInfo(tokenOutAddress);

        const inTokenDecimals = tokenInInfo.decimal;
        const outTokenDecimals = tokenOutInfo.decimal;

        const approval = tokenInAddress === '0x0000000000000000000000000000000000000000' ? false : true;

        const result = await ACTIONS.swap(
            agent,
            tokenInAddress,
            tokenOutAddress,
            amountToSwap,
            inTokenDecimals,
            outTokenDecimals,
            slippageTolerance,
            approval
        )

        return {
            txHash: result.transactionHash || '',
            tokenIn: tokenInAddress,
            tokenOut: tokenOutAddress,
            amountIn: amountToSwap.toString(),
            amountOut: result.amountOut || '0'
        };
    } catch (error) {
        console.error('Error in swap:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to swap tokens',
            'swap_failed',
            500
        );
    }
} 