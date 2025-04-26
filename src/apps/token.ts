import { MonadAgentKit } from '@vib3ai/monad-agent-kit';
import { MonadError } from '../types.js';
import axios from 'axios';

export interface TokenInfo {
    address: string;
    decimal: number;
    name: string;
    ticker: string;
    imageUrl?: string;
    twitter?: string;
    website?: string;
}

export interface SearchTokenResponse {
    tokens: TokenInfo[];
    total: number;
}

/**
 * Search for tokens by name or ticker
 * @param agent MonadAgentKit instance
 * @param query Search query (name or ticker)
 * @returns List of matching tokens
 */
export async function searchTokens(
    agent: MonadAgentKit,
    query: string
): Promise<SearchTokenResponse> {
    try {
        if (!query || typeof query !== 'string') {
            throw new MonadError(
                'Search query must be provided',
                'invalid_query',
                400
            );
        }

        // API endpoint for token search (Kuru API)
        const apiUrl = 'https://api.kuru.io/api/v2/tokens/search';

        const response = await axios.get(apiUrl, {
            params: {
                limit: 20,  // Hardcoded limit to 20
                name: query
            }
        });

        if (!response.data?.success || !response.data?.data?.data) {
            throw new MonadError(
                'Failed to retrieve token data',
                'token_search_failed',
                500
            );
        }

        const tokens = response.data.data.data.map((token: any) => ({
            address: token.address,
            decimal: token.decimal,
            name: token.name,
            ticker: token.ticker,
            imageUrl: token.imageurl,
            twitter: token.twitter,
            website: token.website
        }));

        return {
            tokens,
            total: response.data.data.pagination.total
        };
    } catch (error) {
        console.error('Error in searchTokens:', error);
        if (error instanceof MonadError) {
            throw error;
        }
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to search for tokens',
            'token_search_failed',
            500
        );
    }
} 