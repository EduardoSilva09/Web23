import TransactionType from "../transactionType";
import Validation from "../validation";
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
    this.to = tx?.to || "carteira1";
    this.txInput = tx?.txInput ? new TransactionInput(tx?.txInput) : new TransactionInput()
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
    if (!this.to) return new Validation(false, "Invalid mock transaction.");

    const txInputValidation = this.txInput.isValid();
    if (!txInputValidation.success) return new Validation(false, "Invalid mock transaction.");
    return new Validation();
  }
}
