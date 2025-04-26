import { MonadAgentKit } from '@vib3ai/monad-agent-kit';
import { BalanceResponse, TransactionResponse } from './types.js';
import * as NativeApp from './apps/native.js';
import * as ERC20App from './apps/erc20.js';
import * as ENSApp from './apps/ens.js';
import * as ShmonadApp from './apps/shmonad.js';
import * as KuruApp from './apps/kuru.js';
import * as TokenApp from './apps/token.js';

export class MonadClient {
    private agent: MonadAgentKit;

    constructor(privateKey: string, rpcUrl?: string) {
        // Add 0x prefix if not present
        const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

        // Initialize the MonadAgentKit
        this.agent = new MonadAgentKit(formattedKey);
    }

    // Native operations
    getWalletAddress(): string {
        return this.agent.getWalletAddress();
    }

    async getBalance(address?: string): Promise<BalanceResponse> {
        return NativeApp.getBalance(this.agent, address);
    }

    async transferETH(to: string, amount: string): Promise<TransactionResponse> {
        return NativeApp.transferETH(this.agent, to, amount);
    }

    // ERC20 Token operations
    async getTokenBalance(tokenAddress: string, ownerAddress?: string): Promise<ERC20App.TokenBalanceResponse> {
        return ERC20App.getTokenBalance(this.agent, tokenAddress, ownerAddress);
    }

    async transferToken(tokenAddress: string, to: string, amount: string): Promise<ERC20App.TokenTransferResponse> {
        return ERC20App.transferToken(this.agent, tokenAddress, to, amount);
    }

    async approveToken(tokenAddress: string, spender: string, amount: string): Promise<{ txHash: string }> {
        return ERC20App.approveToken(this.agent, tokenAddress, spender, amount);
    }

    async getTokenAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string): Promise<ERC20App.TokenAllowanceResponse> {
        return ERC20App.getTokenAllowance(this.agent, tokenAddress, ownerAddress, spenderAddress);
    }

    async getTokenInfo(tokenAddress: string): Promise<ERC20App.TokenInfoResponse> {
        return ERC20App.getTokenInfo(this.agent, tokenAddress);
    }

    // ENS operations
    async getENSProfile(name: string): Promise<ENSApp.ProfileResponse> {
        return ENSApp.getProfile(this.agent, name);
    }

    async resolveENSName(name: string): Promise<ENSApp.ResolveAddressResponse> {
        return ENSApp.resolveAddress(this.agent, name);
    }

    async getPrimaryENSName(address: string): Promise<ENSApp.PrimaryNameResponse> {
        return ENSApp.getPrimaryName(this.agent, address);
    }

    async getENSNames(address: string): Promise<string[]> {
        return ENSApp.getNamesForAddress(this.agent, address);
    }

    async getENSDomainPrice(name: string, duration: number = 365): Promise<ENSApp.DomainPriceResponse> {
        return ENSApp.getDomainPrice(this.agent, name, duration);
    }

    async registerENSDomain(name: string, tld?: string, duration?: number): Promise<ENSApp.RegisterDomainResponse> {
        return ENSApp.registerDomain(this.agent, name, tld, duration);
    }

    // Shmonad operations
    async stake(amount: number): Promise<ShmonadApp.StakeResponse> {
        return ShmonadApp.stake(this.agent, amount);
    }

    async unstake(shares: number): Promise<ShmonadApp.UnstakeResponse> {
        return ShmonadApp.unstake(this.agent, shares);
    }

    // Kuru DEX operations
    async getKuruPrice(
        tokenInAddress: string,
        tokenOutAddress: string,
        amountToSwap: number,
        amountType?: 'amountIn' | 'amountOut'
    ): Promise<KuruApp.PriceResponse> {
        return KuruApp.getPrice(this.agent, tokenInAddress, tokenOutAddress, amountToSwap, amountType);
    }

    async swapOnKuru(
        tokenInAddress: string,
        tokenOutAddress: string,
        amountToSwap: number,
        slippageTolerance?: number
    ): Promise<KuruApp.SwapResponse> {
        return KuruApp.swap(
            this.agent,
            tokenInAddress,
            tokenOutAddress,
            amountToSwap,
            slippageTolerance
        );
    }

    // Token search operations
    async searchTokens(
        query: string
    ): Promise<TokenApp.SearchTokenResponse> {
        return TokenApp.searchTokens(this.agent, query);
    }
}
