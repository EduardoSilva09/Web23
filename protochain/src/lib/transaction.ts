import TransactionType from "./transactionType";
import sha256 from "crypto-js/sha256";
import Validation from "./validation";
import TransactionInput from "./transactionInput";

/**
 * Transaction class
 */
export default class Transaction {
  type: TransactionType;
  timestamp: number;
  hash: string;
  to: string;
  txInput: TransactionInput;

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.to = tx?.to || "";
    this.hash = tx?.hash || this.getHash();
    this.txInput = new TransactionInput(tx?.txInput) || new TransactionInput()
  }

  /**
   * Generate a Hash with the Object data
   */
  getHash(): string {
    return sha256(this.type + this.txInput.getHash() + this.to + this.timestamp).toString();
  }

  /**
   * Validates the Transaction
   * @returns Returns true if the transaction is valid
   */
  isValid(): Validation {
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash.");
    if (!this.to) return new Validation(false, "Invalid to.");
    return new Validation();
  }
}
