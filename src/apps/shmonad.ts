import { MonadAgentKit, ACTIONS } from '@vib3ai/monad-agent-kit';
import { MonadError } from '../types.js';

export interface StakeResponse {
    txHash: string;
    status: string;
    message: string;
}

export interface UnstakeResponse {
    txHash: string;
    status: string;
    message: string;
}

/**
 * Stake native tokens (MON) in the Shmonad staking contract
 * @param agent MonadAgentKit instance
 * @param amount The amount to stake in MON
 * @returns Transaction details
 */
export async function stake(
    agent: MonadAgentKit,
    amount: number
): Promise<StakeResponse> {
    try {
        if (typeof amount !== 'number' || amount <= 0) {
            throw new MonadError(
                'Amount must be a positive number',
                'invalid_amount',
                400
            );
        }

        const result = await ACTIONS.stake(agent, amount);

        return {
            txHash: result.transactionHash || '',
            status: result.status || 'pending',
            message: result.message || 'Staking transaction submitted'
        };
    } catch (error) {
        console.error('Error in stake:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to stake tokens',
            'stake_failed',
            500
        );
    }
}

/**
 * Unstake tokens from the Shmonad staking contract
 * @param agent MonadAgentKit instance
 * @param shares The number of shares to unstake
 * @returns Transaction details
 */
export async function unstake(
    agent: MonadAgentKit,
    shares: number
): Promise<UnstakeResponse> {
    try {
        if (typeof shares !== 'number' || shares <= 0) {
            throw new MonadError(
                'Shares must be a positive number',
                'invalid_shares',
                400
            );
        }

        const result = await ACTIONS.unstake(agent, shares);

        return {
            txHash: result.transactionHash || '',
            status: result.status || 'pending',
            message: result.message || 'Unstaking transaction submitted'
        };
    } catch (error) {
        console.error('Error in unstake:', error);
        throw new MonadError(
            error instanceof Error ? error.message : 'Failed to unstake tokens',
            'unstake_failed',
            500
        );
    }
} 