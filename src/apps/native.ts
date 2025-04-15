import { MonadAgentKit, ACTIONS } from '@vib3ai/monad-agent-kit';
import { MonadError, BalanceResponse, TransactionResponse } from '../types.js';

/**
 * Get wallet balance
 * @param agent MonadAgentKit instance
 * @param address Optional address to check (defaults to agent's wallet address)
 * @returns Balance response with address and balance
 */
export async function getBalance(agent: MonadAgentKit, address?: string): Promise<BalanceResponse> {
    try {
        const targetAddress = address || agent.getWalletAddress();

        // Use the native get_balance tool from monad-agent-kit
        const result = await ACTIONS.getBalance(
            agent,
            targetAddress
        );

        return {
            address: targetAddress,
            balance: result.balance || '0'
        };
    } catch (error) {
        console.error('Error in getBalance:', error);
        throw new MonadError(
            'Failed to get balance',
            'get_balance_failed',
            500
        );
    }
}

/**
 * Transfer ETH to another address
 * @param agent MonadAgentKit instance
 * @param to Recipient address
 * @param amount Amount to transfer
 * @returns Transaction response with details
 */
export async function transferETH(agent: MonadAgentKit, to: string, amount: string): Promise<TransactionResponse> {
    try {
        // Use the native transfer tool from monad-agent-kit
        const result = await ACTIONS.transferETH(
            agent,
            to,
            amount
        );

        return {
            txHash: result.txHash || '',
            from: agent.getWalletAddress(),
            to,
            amount
        };
    } catch (error) {
        console.error('Error in transferETH:', error);
        throw new MonadError(
            'Failed to transfer tokens',
            'transferFailed',
            500
        );
    }
} 