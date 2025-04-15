import { Tool, ErrorCode, McpError, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { MonadClient } from '../monad-client.js';
import { ResponseFormatter } from '../formatter.js';
import {
    GetTokenBalanceSchema,
    TransferTokenSchema,
    ApproveTokenSchema,
    GetTokenAllowanceSchema,
    GetTokenInfoSchema,
    MonadError
} from '../types.js';

export const erc20Tools: Tool[] = [
    {
        name: 'getTokenBalance',
        description: 'Get the balance of an ERC20 token',
        inputSchema: {
            type: 'object',
            properties: {
                tokenAddress: {
                    type: 'string',
                    description: 'Address of the ERC20 token contract'
                },
                ownerAddress: {
                    type: 'string',
                    description: 'Address to check balance for. If omitted, uses your wallet address.'
                }
            },
            required: ['tokenAddress']
        }
    },
    {
        name: 'transferToken',
        description: 'Transfer ERC20 tokens to another address',
        inputSchema: {
            type: 'object',
            properties: {
                tokenAddress: {
                    type: 'string',
                    description: 'Address of the ERC20 token contract'
                },
                to: {
                    type: 'string',
                    description: 'Recipient address'
                },
                amount: {
                    type: 'string',
                    description: 'Amount of tokens to transfer'
                }
            },
            required: ['tokenAddress', 'to', 'amount']
        }
    },
    {
        name: 'approveToken',
        description: 'Approve a spender to use your ERC20 tokens',
        inputSchema: {
            type: 'object',
            properties: {
                tokenAddress: {
                    type: 'string',
                    description: 'Address of the ERC20 token contract'
                },
                spender: {
                    type: 'string',
                    description: 'Address of the spender to approve'
                },
                amount: {
                    type: 'string',
                    description: 'Amount of tokens to approve'
                }
            },
            required: ['tokenAddress', 'spender', 'amount']
        }
    },
    {
        name: 'getTokenAllowance',
        description: 'Get the approved allowance for a spender',
        inputSchema: {
            type: 'object',
            properties: {
                tokenAddress: {
                    type: 'string',
                    description: 'Address of the ERC20 token contract'
                },
                ownerAddress: {
                    type: 'string',
                    description: 'Address of the token owner'
                },
                spenderAddress: {
                    type: 'string',
                    description: 'Address of the spender'
                }
            },
            required: ['tokenAddress', 'ownerAddress', 'spenderAddress']
        }
    },
    {
        name: 'getTokenInfo',
        description: 'Get information about an ERC20 token',
        inputSchema: {
            type: 'object',
            properties: {
                tokenAddress: {
                    type: 'string',
                    description: 'Address of the ERC20 token contract'
                }
            },
            required: ['tokenAddress']
        }
    }
];

export async function handleGetTokenBalance(client: MonadClient, args: unknown) {
    const result = GetTokenBalanceSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.getTokenBalance(
            result.data.tokenAddress,
            result.data.ownerAddress
        );

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatTokenBalanceResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error getting token balance:', error);
        throw new MonadError(
            'Failed to get token balance',
            'token_balance_failed',
            500
        );
    }
}

export async function handleTransferToken(client: MonadClient, args: unknown) {
    const result = TransferTokenSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.transferToken(
            result.data.tokenAddress,
            result.data.to,
            result.data.amount
        );

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatTokenTransferResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error transferring tokens:', error);
        throw new MonadError(
            'Failed to transfer tokens',
            'token_transfer_failed',
            500
        );
    }
}

export async function handleApproveToken(client: MonadClient, args: unknown) {
    const result = ApproveTokenSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.approveToken(
            result.data.tokenAddress,
            result.data.spender,
            result.data.amount
        );

        return {
            content: [{
                type: 'text',
                text: `Successfully approved ${result.data.amount} tokens for ${result.data.spender}.\nTransaction hash: ${response.txHash}`
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error approving tokens:', error);
        throw new MonadError(
            'Failed to approve tokens',
            'token_approval_failed',
            500
        );
    }
}

export async function handleGetTokenAllowance(client: MonadClient, args: unknown) {
    const result = GetTokenAllowanceSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.getTokenAllowance(
            result.data.tokenAddress,
            result.data.ownerAddress,
            result.data.spenderAddress
        );

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatTokenAllowanceResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error getting token allowance:', error);
        throw new MonadError(
            'Failed to get token allowance',
            'token_allowance_failed',
            500
        );
    }
}

export async function handleGetTokenInfo(client: MonadClient, args: unknown) {
    const result = GetTokenInfoSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.getTokenInfo(result.data.tokenAddress);

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatTokenInfoResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error getting token info:', error);
        throw new MonadError(
            'Failed to get token info',
            'token_info_failed',
            500
        );
    }
} 