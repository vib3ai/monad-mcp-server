declare module 'monad-agent-kit' {
    export class MonadAgentKit {
        constructor(privateKey: string);
        getWalletAddress(): string;
    }

    export const ACTIONS: {
        NATIVE_ACTIONS: {
            BALANCE: (agent: MonadAgentKit, address: string) => Promise<{ balance: string }>;
            TRANSFER: (agent: MonadAgentKit, to: string, amount: string) => Promise<{ txHash: string }>;
        }
    };
} 