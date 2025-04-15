import { MonadAgentKit, ACTIONS } from 'monad-agent-kit';
import { MonadError, BalanceResponse, TransactionResponse } from './types.js';

export class MonadClient {
    private agent: MonadAgentKit;

    constructor(privateKey: string, rpcUrl?: string) {
        // Add 0x prefix if not present
        const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

        // Initialize the MonadAgentKit
        this.agent = new MonadAgentKit(formattedKey);

        // Log custom RPC URL if provided
        if (rpcUrl) {
            console.log(`Using custom RPC URL: ${rpcUrl}`);
            // Note: RPC URL handling would depend on the actual MonadAgentKit implementation
        }
    }

    getWalletAddress(): string {
        return this.agent.getWalletAddress();
    }

    async getBalance(address?: string): Promise<BalanceResponse> {
        try {
            const targetAddress = address || this.getWalletAddress();

            // Use the native get_balance tool from monad-agent-kit
            // Pass the agent instance to the tool function
            const result = await ACTIONS.NATIVE_ACTIONS.BALANCE(
                this.agent,
                targetAddress
            );

            return {
                address: targetAddress,
                balance: result.balance
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

    async transferTokens(to: string, amount: string): Promise<TransactionResponse> {
        try {
            // Use the native transfer tool from monad-agent-kit
            // Pass the agent instance to the tool function
            const result = await ACTIONS.NATIVE_ACTIONS.TRANSFER(
                this.agent,
                to,
                amount
            );

            return {
                txHash: result.txHash,
                from: this.getWalletAddress(),
                to,
                amount
            };
        } catch (error) {
            console.error('Error in transferTokens:', error);
            throw new MonadError(
                'Failed to transfer tokens',
                'transfer_failed',
                500
            );
        }
    }
}
