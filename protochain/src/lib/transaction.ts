import TransactionType from "./transactionType";
import sha256 from "crypto-js/sha256";
import Validation from "./validation";

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
    return sha256(this.type + this.data + this.timestamp).toString();
  }

  /**
   * Validates the Transaction
   * @returns Returns true if the transaction is valid
   */
  isValid(): Validation {
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash.");
    if (!this.data) return new Validation(false, "Invalid data.");
    return new Validation();
  }
}
