import { z } from 'zod';

// Configuration schema with validation
export const ConfigSchema = z.object({
    privateKey: z.string().min(1, 'Private Key is required'),
    monadRpcUrl: z.string().min(1, 'Monad RPC URL is required')
});

export type Config = z.infer<typeof ConfigSchema>;

// Native tool input schemas
export const GetBalanceSchema = z.object({
    address: z.string().optional()
});

export const TransferTokensSchema = z.object({
    to: z.string().min(1, 'Recipient address cannot be empty'),
    amount: z.string().min(1, 'Amount cannot be empty')
});

// ERC20 tool input schemas
export const GetTokenBalanceSchema = z.object({
    tokenAddress: z.string().min(1, 'Token address is required'),
    ownerAddress: z.string().optional()
});

export const TransferTokenSchema = z.object({
    tokenAddress: z.string().min(1, 'Token address is required'),
    to: z.string().min(1, 'Recipient address is required'),
    amount: z.string().min(1, 'Amount is required')
});

export const ApproveTokenSchema = z.object({
    tokenAddress: z.string().min(1, 'Token address is required'),
    spender: z.string().min(1, 'Spender address is required'),
    amount: z.string().min(1, 'Amount is required')
});

export const GetTokenAllowanceSchema = z.object({
    tokenAddress: z.string().min(1, 'Token address is required'),
    ownerAddress: z.string().min(1, 'Owner address is required'),
    spenderAddress: z.string().min(1, 'Spender address is required')
});

export const GetTokenInfoSchema = z.object({
    tokenAddress: z.string().min(1, 'Token address is required')
});

// ENS tool input schemas
export const GetENSProfileSchema = z.object({
    name: z.string().min(1, 'ENS name is required')
});

export const ResolveENSNameSchema = z.object({
    name: z.string().min(1, 'ENS name is required')
});

export const GetPrimaryENSNameSchema = z.object({
    address: z.string().min(1, 'Address is required')
});

export const GetENSNamesSchema = z.object({
    address: z.string().min(1, 'Address is required')
});

export const GetENSDomainPriceSchema = z.object({
    name: z.string().min(1, 'Domain name is required'),
    duration: z.number().optional()
});

export const RegisterENSDomainSchema = z.object({
    name: z.string().min(1, 'Domain name is required'),
    tld: z.string().optional(),
    duration: z.number().optional()
});

// Type exports for all schemas
export type GetBalanceArgs = z.infer<typeof GetBalanceSchema>;
export type TransferTokensArgs = z.infer<typeof TransferTokensSchema>;
export type GetTokenBalanceArgs = z.infer<typeof GetTokenBalanceSchema>;
export type TransferTokenArgs = z.infer<typeof TransferTokenSchema>;
export type ApproveTokenArgs = z.infer<typeof ApproveTokenSchema>;
export type GetTokenAllowanceArgs = z.infer<typeof GetTokenAllowanceSchema>;
export type GetTokenInfoArgs = z.infer<typeof GetTokenInfoSchema>;
export type GetENSProfileArgs = z.infer<typeof GetENSProfileSchema>;
export type ResolveENSNameArgs = z.infer<typeof ResolveENSNameSchema>;
export type GetPrimaryENSNameArgs = z.infer<typeof GetPrimaryENSNameSchema>;
export type GetENSNamesArgs = z.infer<typeof GetENSNamesSchema>;
export type GetENSDomainPriceArgs = z.infer<typeof GetENSDomainPriceSchema>;
export type RegisterENSDomainArgs = z.infer<typeof RegisterENSDomainSchema>;

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