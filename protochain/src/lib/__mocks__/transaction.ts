import TransactionType from "../transactionType";
import Validation from "../validation";

/**
 * Transaction class
 */
export default class Transaction {
  type: TransactionType;
  timestamp: number;
  hash: string;
  data: string;

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.data = tx?.data || "";
    this.hash = tx?.hash || this.getHash();
  }

  /**
   * Generate a Hash with the Object data
   */
  getHash(): string {
    return 'abc';
  }

  /**
   * Validates the Transaction
   * @returns Returns true if the transaction is valid
   */
  isValid(): Validation {
    if (!this.data) return new Validation(false, "Invalid mock transaction.");
    return new Validation();
  }
}
