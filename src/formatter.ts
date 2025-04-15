import { FormattedTransaction, TransactionResponse, BalanceResponse } from './types.js';

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