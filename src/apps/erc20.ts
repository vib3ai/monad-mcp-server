import { MonadAgentKit, ACTIONS } from '@vib3ai/monad-agent-kit';
import { MonadError } from '../types.js';

export interface TokenBalanceResponse {
    address: string;
    tokenAddress: string;
    tokenName?: string;
    balance: string;
}

export interface TokenTransferResponse {
    txHash: string;
    from: string;
    to: string;
    tokenAddress: string;
    amount: string;
}

export interface TokenAllowanceResponse {
    tokenAddress: string;
    ownerAddress: string;
    spenderAddress: string;
    allowance: string;
}

export interface TokenInfoResponse {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
}

/**
 * Get the balance of an ERC20 token for a specific address
 * @param agent MonadAgentKit instance
 * @param tokenAddress The ERC20 token address
 * @param ownerAddress Optional address to check (defaults to agent's wallet address)
 * @returns Token balance information
 */
export async function getTokenBalance(
    agent: MonadAgentKit,
    tokenAddress: string,
    ownerAddress?: string
): Promise<TokenBalanceResponse> {
    try {
        // Ensure tokenAddress is a string
        if (!tokenAddress || typeof tokenAddress !== 'string') {
            throw new MonadError(
                'Token address must be a valid string address',
                'invalid_token_address',
                400
            );
        }

        // Call ACTIONS with direct parameters
        const result = await ACTIONS.getTokenBalance(agent, tokenAddress, undefined, ownerAddress);

        if (result.status === 'error') {
            throw new MonadError(
                result.message || 'Failed to get token balance',
                'token_balance_failed',
                500
            );
        }

        const walletAddress = ownerAddress || agent.getWalletAddress();

        return {
            address: result.ownerAddress || walletAddress,
            tokenAddress: result.tokenAddress || tokenAddress,
            tokenName: result.tokenName,
            balance: result.balance || '0'
        };
    } catch (error) {
        console.error('Error in getTokenBalance:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to get token balance',
            'token_balance_failed',
            500
        );
    }
}

/**
 * Transfer ERC20 tokens to another address
 * @param agent MonadAgentKit instance
 * @param tokenAddress The ERC20 token address
 * @param to Recipient address
 * @param amount Amount to transfer
 * @returns Transaction details
 */
export async function transferToken(
    agent: MonadAgentKit,
    tokenAddress: string,
    to: string,
    amount: string
): Promise<TokenTransferResponse> {
    try {
        // Ensure addresses are strings
        if (!tokenAddress || typeof tokenAddress !== 'string' || !to || typeof to !== 'string') {
            throw new MonadError(
                'Token address and recipient address must be valid strings',
                'invalid_address',
                400
            );
        }

        // Call ACTIONS with direct parameters
        const result = await ACTIONS.transferToken(agent, tokenAddress, to, amount);

        if (result.status === 'error') {
            throw new MonadError(
                result.message || 'Failed to transfer tokens',
                'token_transfer_failed',
                500
            );
        }

        // Handle different response formats
        let txHash = '';
        if (result.txHash) {
            if (typeof result.txHash === 'object' && result.txHash !== null) {
                // @ts-ignore - Handle potential response format with transactionHash
                txHash = result.txHash.transactionHash || '';
            } else {
                txHash = result.txHash.toString();
            }
        }

        return {
            txHash,
            from: agent.getWalletAddress(),
            to: result.to || to,
            tokenAddress: result.tokenAddress || tokenAddress,
            amount: result.amount || amount
        };
    } catch (error) {
        console.error('Error in transferToken:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to transfer tokens',
            'token_transfer_failed',
            500
        );
    }
}

/**
 * Approve a spender to use tokens on behalf of the owner
 * @param agent MonadAgentKit instance
 * @param tokenAddress The ERC20 token address
 * @param spender Spender address
 * @param amount Amount to approve
 * @returns Transaction details
 */
export async function approveToken(
    agent: MonadAgentKit,
    tokenAddress: string,
    spender: string,
    amount: string
): Promise<{ txHash: string; }> {
    try {
        // Ensure addresses are strings
        if (!tokenAddress || typeof tokenAddress !== 'string' || !spender || typeof spender !== 'string') {
            throw new MonadError(
                'Token address and spender address must be valid strings',
                'invalid_address',
                400
            );
        }

        // Call ACTIONS with direct parameters
        const result = await ACTIONS.approveToken(agent, tokenAddress, spender, amount);

        if (result.status === 'error') {
            throw new MonadError(
                result.message || 'Failed to approve tokens',
                'token_approval_failed',
                500
            );
        }

        // Handle different response formats
        let txHash = '';
        if (result.txHash) {
            if (typeof result.txHash === 'object' && result.txHash !== null) {
                // @ts-ignore - Handle potential response format with transactionHash
                txHash = result.txHash.transactionHash || '';
            } else {
                txHash = result.txHash.toString();
            }
        }

        return {
            txHash
        };
    } catch (error) {
        console.error('Error in approveToken:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to approve tokens',
            'token_approval_failed',
            500
        );
    }
}

/**
 * Get the allowance of tokens a spender can use
 * @param agent MonadAgentKit instance
 * @param tokenAddress The ERC20 token address
 * @param ownerAddress Owner address
 * @param spenderAddress Spender address
 * @returns Allowance information
 */
export async function getTokenAllowance(
    agent: MonadAgentKit,
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string
): Promise<TokenAllowanceResponse> {
    try {
        // Ensure addresses are strings
        if (!tokenAddress || typeof tokenAddress !== 'string' ||
            !ownerAddress || typeof ownerAddress !== 'string' ||
            !spenderAddress || typeof spenderAddress !== 'string') {
            throw new MonadError(
                'Token address, owner address, and spender address must be valid strings',
                'invalid_address',
                400
            );
        }

        // Call ACTIONS with direct parameters
        const result = await ACTIONS.getTokenAllowance(agent, tokenAddress, ownerAddress, spenderAddress);

        if (result.status === 'error') {
            throw new MonadError(
                result.message || 'Failed to get token allowance',
                'token_allowance_failed',
                500
            );
        }

        return {
            tokenAddress: result.tokenAddress || tokenAddress,
            ownerAddress: result.ownerAddress || ownerAddress,
            spenderAddress: result.spenderAddress || spenderAddress,
            allowance: result.allowance || '0'
        };
    } catch (error) {
        console.error('Error in getTokenAllowance:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to get token allowance',
            'token_allowance_failed',
            500
        );
    }
}

/**
 * Get token information
 * @param agent MonadAgentKit instance
 * @param tokenAddress The ERC20 token address
 * @returns Token information
 */
export async function getTokenInfo(
    agent: MonadAgentKit,
    tokenAddress: string
): Promise<TokenInfoResponse> {
    try {
        // Ensure tokenAddress is a string
        if (!tokenAddress || typeof tokenAddress !== 'string') {
            throw new MonadError(
                'Token address must be a valid string address',
                'invalid_token_address',
                400
            );
        }

        // Call ACTIONS with direct parameters
        const result = await ACTIONS.getTokenInfo(agent, tokenAddress);

        if (result.status === 'error') {
            throw new MonadError(
                result.message || 'Failed to get token info',
                'token_info_failed',
                500
            );
        }

        // Handle different response structures
        // If result has 'info' property (as in implementation)
        if (result.info) {
            return {
                address: tokenAddress,
                name: result.info.name || '',
                symbol: result.info.symbol || '',
                decimals: result.info.decimals || 18,
                totalSupply: result.info.totalSupply || '0'
            };
        }

        // If result has direct properties (as in type definition)
        return {
            address: tokenAddress,
            name: result.name || '',
            symbol: result.symbol || '',
            decimals: result.decimals || 18,
            totalSupply: result.totalSupply || '0'
        };
    } catch (error) {
        console.error('Error in getTokenInfo:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to get token info',
            'token_info_failed',
            500
        );
    }
} 