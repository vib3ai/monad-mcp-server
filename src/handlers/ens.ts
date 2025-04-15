import { Tool, ErrorCode, McpError, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { MonadClient } from '../monad-client.js';
import { ResponseFormatter } from '../formatter.js';
import {
    GetENSProfileSchema,
    ResolveENSNameSchema,
    GetPrimaryENSNameSchema,
    GetENSNamesSchema,
    GetENSDomainPriceSchema,
    RegisterENSDomainSchema,
    MonadError
} from '../types.js';

export const ensTools: Tool[] = [
    {
        name: 'getENSProfile',
        description: 'Get the profile information for an ENS name',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The ENS name to look up'
                }
            },
            required: ['name']
        }
    },
    {
        name: 'resolveENSName',
        description: 'Resolve an ENS name to an Ethereum address',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The ENS name to resolve'
                }
            },
            required: ['name']
        }
    },
    {
        name: 'getPrimaryENSName',
        description: 'Get the primary ENS name for an Ethereum address',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'The Ethereum address to look up'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'getENSNames',
        description: 'Get all ENS names owned by an address',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'The Ethereum address to look up'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'getENSDomainPrice',
        description: 'Get the price for registering an ENS domain',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The domain name (without TLD)'
                },
                duration: {
                    type: 'number',
                    description: 'Registration duration in days (default: 365)'
                }
            },
            required: ['name']
        }
    },
    {
        name: 'registerENSDomain',
        description: 'Register/buy an ENS domain',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The domain name to register (without TLD)'
                },
                tld: {
                    type: 'string',
                    description: 'The top-level domain (default: "nad")'
                },
                duration: {
                    type: 'number',
                    description: 'Registration duration in days (default: 365)'
                }
            },
            required: ['name']
        }
    }
];

export async function handleGetENSProfile(client: MonadClient, args: unknown) {
    const result = GetENSProfileSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.getENSProfile(result.data.name);

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatProfileResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error getting ENS profile:', error);
        throw new MonadError(
            'Failed to get ENS profile',
            'ens_profile_failed',
            500
        );
    }
}

export async function handleResolveENSName(client: MonadClient, args: unknown) {
    const result = ResolveENSNameSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.resolveENSName(result.data.name);

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatResolveAddressResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error resolving ENS name:', error);
        throw new MonadError(
            'Failed to resolve ENS name',
            'ens_resolve_failed',
            500
        );
    }
}

export async function handleGetPrimaryENSName(client: MonadClient, args: unknown) {
    const result = GetPrimaryENSNameSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.getPrimaryENSName(result.data.address);

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatPrimaryNameResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error getting primary ENS name:', error);
        throw new MonadError(
            'Failed to get primary ENS name',
            'ens_primary_name_failed',
            500
        );
    }
}

export async function handleGetENSNames(client: MonadClient, args: unknown) {
    const result = GetENSNamesSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const names = await client.getENSNames(result.data.address);

        return {
            content: [{
                type: 'text',
                text: names.length > 0
                    ? `ENS Names for ${result.data.address}:\n${names.join('\n')}`
                    : `No ENS names found for ${result.data.address}`
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error getting ENS names:', error);
        throw new MonadError(
            'Failed to get ENS names',
            'ens_get_names_failed',
            500
        );
    }
}

export async function handleGetENSDomainPrice(client: MonadClient, args: unknown) {
    const result = GetENSDomainPriceSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.getENSDomainPrice(
            result.data.name,
            result.data.duration
        );

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatDomainPriceResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error getting ENS domain price:', error);
        throw new MonadError(
            'Failed to get ENS domain price',
            'ens_price_failed',
            500
        );
    }
}

export async function handleRegisterENSDomain(client: MonadClient, args: unknown) {
    const result = RegisterENSDomainSchema.safeParse(args);
    if (!result.success) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${result.error.message}`
        );
    }

    try {
        const response = await client.registerENSDomain(
            result.data.name,
            result.data.tld,
            result.data.duration
        );

        return {
            content: [{
                type: 'text',
                text: ResponseFormatter.formatRegisterDomainResponse(response)
            }] as TextContent[]
        };
    } catch (error) {
        if (error instanceof MonadError) {
            throw error;
        }
        console.error('Error registering ENS domain:', error);
        throw new MonadError(
            'Failed to register ENS domain',
            'ens_register_failed',
            500
        );
    }
} 