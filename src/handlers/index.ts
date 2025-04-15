import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MonadClient } from '../monad-client.js';

// Import all handlers
import * as NativeHandlers from './native.js';
import * as ERC20Handlers from './erc20.js';
import * as ENSHandlers from './ens.js';

// Export all tool definitions
export const allTools: Tool[] = [
    ...NativeHandlers.nativeTools,
    ...ERC20Handlers.erc20Tools,
    ...ENSHandlers.ensTools
];

// Create a mapping of tool names to handler functions
type HandlerFunction = (client: MonadClient, args: unknown) => Promise<any>;

const handlers: Record<string, HandlerFunction> = {
    // Native handlers
    getBalance: NativeHandlers.handleGetBalance,
    transferETH: NativeHandlers.handleTransferETH,

    // ERC20 handlers
    getTokenBalance: ERC20Handlers.handleGetTokenBalance,
    transferToken: ERC20Handlers.handleTransferToken,
    approveToken: ERC20Handlers.handleApproveToken,
    getTokenAllowance: ERC20Handlers.handleGetTokenAllowance,
    getTokenInfo: ERC20Handlers.handleGetTokenInfo,

    // ENS handlers
    getENSProfile: ENSHandlers.handleGetENSProfile,
    resolveENSName: ENSHandlers.handleResolveENSName,
    getPrimaryENSName: ENSHandlers.handleGetPrimaryENSName,
    getENSNames: ENSHandlers.handleGetENSNames,
    getENSDomainPrice: ENSHandlers.handleGetENSDomainPrice,
    registerENSDomain: ENSHandlers.handleRegisterENSDomain
};

export function getHandler(toolName: string): HandlerFunction | undefined {
    return handlers[toolName];
} 