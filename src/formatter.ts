import { FormattedTransaction, TransactionResponse, BalanceResponse } from './types.js';
import { TokenBalanceResponse, TokenTransferResponse, TokenAllowanceResponse, TokenInfoResponse } from './apps/erc20.js';
import { ProfileResponse, ResolveAddressResponse, PrimaryNameResponse, DomainPriceResponse, RegisterDomainResponse } from './apps/ens.js';

export class ResponseFormatter {
  static formatTransaction(tx: TransactionResponse): FormattedTransaction {
    return {
      hash: tx.txHash,
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
      status: 'Completed'
    };
  }

  static formatBalanceResponse(response: BalanceResponse): string {
    return `Address: ${response.address}\nBalance: ${response.balance} ETH`;
  }

  static formatTransactionResponse(tx: TransactionResponse): string {
    const formatted = this.formatTransaction(tx);
    return [
      'TRANSACTION DETAILS',
      `Hash: ${formatted.hash}`,
      `From: ${formatted.from}`,
      `To: ${formatted.to}`,
      `Amount: ${formatted.amount} ETH`,
      `Status: ${formatted.status}`
    ].join('\n');
  }

  static formatTokenBalanceResponse(response: TokenBalanceResponse): string {
    return [
      'TOKEN BALANCE',
      `Address: ${response.address}`,
      `Token: ${response.tokenName || response.tokenAddress}`,
      `Balance: ${response.balance}`
    ].join('\n');
  }

  static formatTokenTransferResponse(response: TokenTransferResponse): string {
    return [
      'TOKEN TRANSFER DETAILS',
      `Transaction Hash: ${response.txHash}`,
      `From: ${response.from}`,
      `To: ${response.to}`,
      `Token Address: ${response.tokenAddress}`,
      `Amount: ${response.amount}`
    ].join('\n');
  }

  static formatTokenAllowanceResponse(response: TokenAllowanceResponse): string {
    return [
      'TOKEN ALLOWANCE',
      `Token: ${response.tokenAddress}`,
      `Owner: ${response.ownerAddress}`,
      `Spender: ${response.spenderAddress}`,
      `Allowance: ${response.allowance}`
    ].join('\n');
  }

  static formatTokenInfoResponse(response: TokenInfoResponse): string {
    return [
      'TOKEN INFORMATION',
      `Address: ${response.address}`,
      `Name: ${response.name}`,
      `Symbol: ${response.symbol}`,
      `Decimals: ${response.decimals}`,
      `Total Supply: ${response.totalSupply}`
    ].join('\n');
  }

  static formatProfileResponse(response: ProfileResponse): string {
    const attributes = Object.entries(response.attributes || {})
      .map(([key, value]) => `  ${key}: ${value}`)
      .join('\n');

    return [
      'ENS PROFILE',
      `Name: ${response.name}`,
      `Address: ${response.address}`,
      'Attributes:',
      attributes || '  No attributes found'
    ].join('\n');
  }

  static formatResolveAddressResponse(response: ResolveAddressResponse): string {
    return [
      'ENS NAME RESOLUTION',
      `Name: ${response.name}`,
      `Address: ${response.address}`
    ].join('\n');
  }

  static formatPrimaryNameResponse(response: PrimaryNameResponse): string {
    return [
      'PRIMARY ENS NAME',
      `Address: ${response.address}`,
      `Name: ${response.name || 'No primary name set'}`
    ].join('\n');
  }

  static formatDomainPriceResponse(response: DomainPriceResponse): string {
    return [
      'ENS DOMAIN PRICE',
      `Name: ${response.name}`,
      `Duration: ${response.duration} days`,
      `Price: ${response.price}`
    ].join('\n');
  }

  static formatRegisterDomainResponse(response: RegisterDomainResponse): string {
    return [
      'ENS DOMAIN REGISTRATION',
      `Name: ${response.name}`,
      `Transaction Hash: ${response.txHash}`,
      `Duration: ${response.duration} days`
    ].join('\n');
  }

  static toMcpResponse(response: string | FormattedTransaction): string {
    if (typeof response === 'string') {
      return response;
    }

    return [
      'MONAD TRANSACTION',
      `Hash: ${response.hash}`,
      `From: ${response.from}`,
      `To: ${response.to}`,
      `Amount: ${response.amount} ETH`,
      `Status: ${response.status}`
    ].join('\n');
  }
}