import Transaction from "./transaction";
import Validation from "../validation";
/**
 * Mocked Block Class
 */
export default class Block {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  transactions: Transaction[];
  nonce: number;
  miner: string;

  /**
   * Creates a new mocked block
   * @param block The mock block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.transactions = block?.transactions || [] as Transaction[];
    this.previousHash = block?.previousHash || "";
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || "abc";
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return this.hash || "abc";
  }

  mine(difficulty: number, miner: string) {
    this.miner = miner;
  }

  /**
   * Validates the mock block
   * @returns Returns true if the mock block is valid
   */
  isValid(previousHash: string, previousIndex: number,
    feePerTx: number): Validation {
    if (!previousHash || previousIndex < 0 || this.index < 0 || feePerTx < 1)
      return new Validation(false, "Invalid mock block");
    return new Validation();
  }
}
