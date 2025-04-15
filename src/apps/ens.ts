import { MonadAgentKit, ACTIONS, HexString } from '@vib3ai/monad-agent-kit';
import { MonadError } from '../types.js';

export interface ProfileResponse {
    name: string;
    address: string;
    attributes: Record<string, string>;
}

export interface ResolveAddressResponse {
    name: string;
    address: string;
}

export interface PrimaryNameResponse {
    address: string;
    name: string;
}

export interface DomainPriceResponse {
    name: string;
    duration: number;
    price: string;
}

export interface RegisterDomainResponse {
    name: string;
    txHash: string;
    duration: number;
}

/**
 * Convert a string address to HexString format
 */
function toHexString(address: string): HexString {
    return (address.startsWith('0x') ? address : `0x${address}`) as HexString;
}

/**
 * Get ENS profile information for a name
 * @param agent MonadAgentKit instance
 * @param name The ENS name to look up
 * @returns Profile information
 */
export async function getProfile(
    agent: MonadAgentKit,
    name: string
): Promise<ProfileResponse> {
    try {
        const result = await ACTIONS.getProfile(agent, name);

        // Extract information from the profile
        const profile = result.profile || {};
        const address = profile.address || '';

        if (!address) {
            throw new MonadError(
                `Profile not found for ${name}`,
                'ens_profile_not_found',
                404
            );
        }

        return {
            name,
            address,
            attributes: profile.records || {}
        };
    } catch (error) {
        console.error('Error in getProfile:', error);
        throw new MonadError(
            `Failed to get profile for ${name}`,
            'ens_profile_failed',
            500
        );
    }
}

/**
 * Resolve an ENS name to an Ethereum address
 * @param agent MonadAgentKit instance
 * @param name The ENS name to resolve
 * @returns The resolved address
 */
export async function resolveAddress(
    agent: MonadAgentKit,
    name: string
): Promise<ResolveAddressResponse> {
    try {
        const result = await ACTIONS.resolveAddress(agent, name);

        // The address is expected to be a hex string
        const address = result.address || '';

        if (!address) {
            throw new MonadError(
                `Name not found: ${name}`,
                'ens_name_not_found',
                404
            );
        }

        return {
            name,
            address
        };
    } catch (error) {
        console.error('Error in resolveAddress:', error);
        throw new MonadError(
            `Failed to resolve address for ${name}`,
            'ens_resolve_failed',
            500
        );
    }
}

/**
 * Get the primary ENS name for an address
 * @param agent MonadAgentKit instance
 * @param address The Ethereum address to look up
 * @returns The primary name information
 */
export async function getPrimaryName(
    agent: MonadAgentKit,
    address: string
): Promise<PrimaryNameResponse> {
    try {
        // Convert the address to the expected format
        const hexAddress = toHexString(address);

        const result = await ACTIONS.getPrimaryName(agent, hexAddress);

        return {
            address,
            name: result.primaryName || ''
        };
    } catch (error) {
        console.error('Error in getPrimaryName:', error);
        throw new MonadError(
            `Failed to get primary name for ${address}`,
            'ens_primary_name_failed',
            500
        );
    }
}

/**
 * Get all ENS names owned by an address
 * @param agent MonadAgentKit instance
 * @param address The Ethereum address to look up
 * @returns Array of names
 */
export async function getNamesForAddress(
    agent: MonadAgentKit,
    address: string
): Promise<string[]> {
    try {
        // Convert the address to the expected format
        const hexAddress = toHexString(address);

        const result = await ACTIONS.getNamesForAddress(agent, hexAddress);
        return result.names || [];
    } catch (error) {
        console.error('Error in getNamesForAddress:', error);
        throw new MonadError(
            `Failed to get names for ${address}`,
            'ens_get_names_failed',
            500
        );
    }
}

/**
 * Get the price for registering an ENS domain
 * @param agent MonadAgentKit instance
 * @param name The domain name (without TLD)
 * @param duration Registration duration in days
 * @returns Price information
 */
export async function getDomainPrice(
    agent: MonadAgentKit,
    name: string,
    duration: number = 365
): Promise<DomainPriceResponse> {
    try {
        const result = await ACTIONS.getDomainPrice(agent, name, duration);

        if (!result.success) {
            throw new MonadError(
                result.error || `Could not get price for ${name}`,
                'ens_price_failed',
                500
            );
        }

        return {
            name,
            duration,
            price: result.price.toString()
        };
    } catch (error) {
        console.error('Error in getDomainPrice:', error);
        throw new MonadError(
            `Failed to get price for ${name}`,
            'ens_price_failed',
            500
        );
    }
}

/**
 * Register/buy an ENS domain
 * @param agent MonadAgentKit instance
 * @param name The domain name to register (without TLD)
 * @param tld The top-level domain (e.g., 'nad')
 * @param duration Registration duration in days
 * @returns Registration details
 */
export async function registerDomain(
    agent: MonadAgentKit,
    name: string,
    tld: string = 'nad',
    duration: number = 365
): Promise<RegisterDomainResponse> {
    try {
        const result = await ACTIONS.registerDomain(agent, name, tld, duration);

        // transactionHash is the field name in the response
        if (!result.transactionHash) {
            throw new MonadError(
                `Failed to register domain ${name}.${tld}`,
                'ens_register_failed',
                500
            );
        }

        return {
            name: `${name}.${tld}`,
            txHash: result.transactionHash,
            duration
        };
    } catch (error) {
        console.error('Error in registerDomain:', error);
        throw new MonadError(
            `Failed to register domain ${name}.${tld}`,
            'ens_register_failed',
            500
        );
    }
} 