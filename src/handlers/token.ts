import { Tool, ErrorCode, McpError, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { MonadClient } from '../monad-client.js';
import { z } from 'zod';
import { TokenInfo } from '../apps/token.js';

// Zod schemas for input validation
export const SearchTokensSchema = z.object({
    query: z.string().min(1).describe('Search query (token name or ticker)')
});

// Tool definitions
export const tokenTools: Tool[] = [
    {
        name: 'searchTokens',
        description: 'Search for tokens by name or ticker symbol on Monad',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query (token name or ticker)'
                }
            },
            required: ['query']
        }
    }
];

export async function handleSearchTokens(client: MonadClient, args: unknown) {
    const result = SearchTokensSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.searchTokens(
            result.data.query
        );

        if (response.tokens.length === 0) {
            return {
                content: [{
                    type: 'text',
                    text: `No tokens found matching "${result.data.query}"`
                }] as TextContent[]
            };
        }

        const tokenList = response.tokens.map((token: TokenInfo, index: number) => {
            return `${index + 1}. ${token.name} (${token.ticker})
   Address: ${token.address}
   Decimals: ${token.decimal}
   ${token.website ? `Website: ${token.website}` : ''}`;
        }).join('\n\n');

        return {
            content: [{
                type: 'text',
                text: `Found ${response.total} tokens matching "${result.data.query}":\n\n${tokenList}`
            }] as TextContent[]
        };
    } catch (error) {
        console.error('Error searching tokens:', error);
        throw new McpError(
            ErrorCode.InternalError,
            'Failed to search for tokens'
        );
    }
} 