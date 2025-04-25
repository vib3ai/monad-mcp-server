declare module '@vib3ai/monad-agent-kit' {
    export class MonadAgentKit {
        constructor(privateKey: string);
        getWalletAddress(): string;
    }

    export type HexString = `0x${string}`;

    // ENS Types
    export interface Profile {
        records?: Record<string, string>;
        address?: string;
        contentHash?: string;
        texts?: string[];
    }

    export interface EnsProfileResult {
        profile: Profile;
        name: string;
    }

    export interface EnsResolveResult {
        address: string;
        name: string;
    }

    export interface EnsPrimaryNameResult {
        primaryName: string;
        address: HexString;
    }

    export interface EnsNamesResult {
        names: string[];
        address: HexString;
    }

    export interface EnsDomainPriceResult {
        success: boolean;
        price: bigint;
        error?: string;
    }

    export interface EnsRegisterResult {
        transactionHash: HexString;
        status: string;
        message: string;
        domainName: string;
        duration: number;
        price: string;
        registrantAddress: string;
    }

    // ERC20 Types
    export interface TokenBalanceResult {
        status: string;
        balance: string;
        tokenAddress: string;
        tokenName?: string;
        ownerAddress: string;
        message?: string;
    }

    export interface TokenTransferResult {
        status: string;
        txHash: string;
        tokenAddress: string;
        to: string;
        amount: string;
        message?: string;
    }

    export interface TokenApprovalResult {
        status: string;
        txHash: string;
        tokenAddress: string;
        spender: string;
        amount: string;
        message?: string;
    }

    export interface TokenAllowanceResult {
        status: string;
        allowance: string;
        tokenAddress: string;
        ownerAddress: string;
        spenderAddress: string;
        message?: string;
    }

    export interface TokenInfoResult {
        status: string;
        name?: string;
        symbol?: string;
        decimals?: number;
        totalSupply?: string;
        info?: {
            name: string;
            symbol: string;
            decimals: number;
            totalSupply: string;
        };
        tokenAddress?: string;
        message?: string;
    }

    // Native Types
    export interface BalanceResult {
        balance: string;
        address: string;
    }

    export interface TransferResult {
        txHash: string;
        from: string;
        to: string;
        amount: string;
    }

    // Shmonad Types
    export interface ShmonadStakeResult {
        transactionHash: string;
        status: string;
        message: string;
    }

    export interface ShmonadUnstakeResult {
        transactionHash: string;
        status: string;
        message: string;
    }

    // Actions
    export const ACTIONS: {
        // Native actions
        getBalance: (agent: MonadAgentKit, address: string) => Promise<BalanceResult>;
        transferETH: (agent: MonadAgentKit, to: string, amount: string) => Promise<TransferResult>;

        // ENS actions
        getProfile: (agent: MonadAgentKit, name: string) => Promise<EnsProfileResult>;
        resolveAddress: (agent: MonadAgentKit, name: string) => Promise<EnsResolveResult>;
        getPrimaryName: (agent: MonadAgentKit, address: HexString) => Promise<EnsPrimaryNameResult>;
        getNamesForAddress: (agent: MonadAgentKit, address: HexString) => Promise<EnsNamesResult>;
        getDomainPrice: (agent: MonadAgentKit, name: string, duration?: number) => Promise<EnsDomainPriceResult>;
        registerDomain: (agent: MonadAgentKit, name: string, tld?: string, duration?: number) => Promise<EnsRegisterResult>;

        // ERC20 actions - using direct parameters to match implementation
        getTokenBalance: (
            agent: MonadAgentKit,
            tokenAddress?: string,
            token?: string,
            ownerAddress?: string
        ) => Promise<TokenBalanceResult>;

        transferToken: (
            agent: MonadAgentKit,
            tokenAddress: string,
            to: string,
            amount: string
        ) => Promise<TokenTransferResult>;

        approveToken: (
            agent: MonadAgentKit,
            tokenAddress: string,
            spender: string,
            amount: string
        ) => Promise<TokenApprovalResult>;

        getTokenAllowance: (
            agent: MonadAgentKit,
            tokenAddress: string,
            ownerAddress: string,
            spenderAddress: string
        ) => Promise<TokenAllowanceResult>;

        getTokenInfo: (
            agent: MonadAgentKit,
            tokenAddress: string
        ) => Promise<TokenInfoResult>;

        // Shmonad actions
        stake: (agent: MonadAgentKit, amount: number) => Promise<ShmonadStakeResult>;
        unstake: (agent: MonadAgentKit, shares: number) => Promise<ShmonadUnstakeResult>;
    };
} 