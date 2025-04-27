import { MonadAgentKit, nadfunTools } from '@vib3ai/monad-agent-kit';
import { MonadError } from '../types.js';
import { Buffer } from 'buffer';
import axios from 'axios';

export interface CreateCurveResponse {
    txHash: string;
    status: string;
    message: string;
}

/**
 * Creates a new curve token with metadata using the nadfun protocol
 * @param agent MonadAgentKit instance
 * @param name The name of the token
 * @param symbol The symbol of the token
 * @param description The description of the token
 * @param imageUrl URL of the image to use for the token
 * @param amountIn The amount of ETH to invest in ETH (e.g., "0.5"). Minimum required amount is 0.5 ETH.
 * @param homePage Optional home page URL
 * @param twitter Optional Twitter URL
 * @param telegram Optional Telegram URL
 * @returns The transaction result with curve address, token address, and other details
 */
export async function createCurveWithMetadata(
    agent: MonadAgentKit,
    name: string,
    symbol: string,
    description: string,
    imageUrl: string,
    amountIn: string,
    homePage?: string,
    twitter?: string,
    telegram?: string
): Promise<CreateCurveResponse> {
    try {
        if (!name || !symbol || !description || !imageUrl || !amountIn) {
            throw new MonadError(
                'Required parameters missing',
                'invalid_parameters',
                400
            );
        }

        // Validate minimum investment amount (0.5 ETH)
        const amountValue = parseFloat(amountIn);
        if (isNaN(amountValue) || amountValue < 0.5) {
            throw new MonadError(
                'Minimum investment amount is 0.5 ETH',
                'invalid_amount',
                400
            );
        }

        // Download image from URL
        let buffer: Buffer;
        let imageType: string;

        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data, 'binary');

            // Determine image type from content-type header
            imageType = response.headers['content-type'] || 'image/jpeg';

            // Validate image type
            if (!imageType.startsWith('image/')) {
                throw new MonadError(
                    'Invalid image type. Only images are supported.',
                    'invalid_image',
                    400
                );
            }
        } catch (error) {
            throw new MonadError(
                'Failed to download image from URL',
                'image_download_failed',
                400
            );
        }

        // Import the nadfun tools

        // Call the createCurveWithMetadata function from nadfun tools
        const result = await nadfunTools.createCurveWithMetadata(
            agent as any, // Type assertion to bypass type check
            undefined, // Creator address (defaults to wallet address)
            name,
            symbol,
            description,
            buffer,
            imageType,
            amountIn,
            homePage,
            twitter,
            telegram
        );

        if (result.status === 'error') {
            throw new MonadError(
                result.message || 'Failed to create curve',
                'curve_creation_failed',
                500
            );
        }

        return {
            txHash: result.txHash || '',
            status: result.status,
            message: result.message || 'Transaction submitted successfully'
        };
    } catch (error) {
        console.error('Error in createCurveWithMetadata:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to create curve',
            'curve_creation_failed',
            500
        );
    }
} 