import { z } from 'zod';

// Configuration schema with validation
export const ConfigSchema = z.object({
    privateKey: z.string().min(1, 'Private Key is required'),
    monadRpcUrl: z.string().min(1, 'Monad RPC URL is required')
});

export type Config = z.infer<typeof ConfigSchema>;

// Tool input schemas
export const GetBalanceSchema = z.object({
    address: z.string().optional()
});

export const TransferTokensSchema = z.object({
    to: z.string().min(1, 'Recipient address cannot be empty'),
    amount: z.string().min(1, 'Amount cannot be empty')
});

export type GetBalanceArgs = z.infer<typeof GetBalanceSchema>;
export type TransferTokensArgs = z.infer<typeof TransferTokensSchema>;

// Response types
export interface BalanceResponse {
    address: string;
    balance: string;
}

export interface TransactionResponse {
    txHash: string;
    from: string;
    to: string;
    amount: string;
}

// Error types
export class MonadError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly status?: number
    ) {
        super(message);
        this.name = 'MonadError';
    }
}

// Response formatter types
export interface FormattedTransaction {
    hash: string;
    from: string;
    to: string;
    amount: string;
    status: string;
}