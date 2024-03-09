import Block from "../block";
import BlockInfo from "../blockInfo";
import Transaction from "./transaction";
import Validation from "../validation";
import TransactionType from "../transactionType";
import TransactionSearch from "../transactionSearch";
import TransactionInput from "./transactionInput";
/**
 * Mocked Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  mempool: Transaction[];
  nextIndex: number = 0;

  /**
   * Creates a new mocked blockchain
   */
  constructor(miner: string) {
    this.blocks = [];
    this.mempool = [new Transaction()]

    this.blocks = [
      new Block({
        index: 0,
        hash: "abc",
        miner,
        timestamp: Date.now(),
      } as Block),
    ];
    this.mempool = [];
    this.nextIndex++;
  }

  /**
   * Get the last block added
   * @returns Returns the last block added
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * Adds a new block to the mock blockchain
   * @param block Block to be added
   * @returns Returns true if block is added
   */
  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, "Invalid mock block.");

    this.blocks.push(block);
    this.nextIndex++;
    return new Validation();
  }

  /**
   * Find the block with the informed hash
   * @param hash Block hash
   * @returns Returns the found block or undefined
   */
  getBlock(hash: string): Block | undefined {
    if (!hash || hash === '-1') return undefined;

    return this.blocks.find((b) => b.hash === hash);
  }

  /**
   * Validates the mock blockchain
   * @returns Returns true if the mock blockchain is valid
   */
  isValid(): Validation {
    return new Validation();
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
    const difficulty = 1;
    const previousHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const maxDifficulty = 62;

    return {
      index,
      previousHash,
      difficulty,
      maxDifficulty,
      feePerTx,
      transactions: this.mempool.slice(0, 2),
    } as BlockInfo;
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid()
    if (!validation.success) { return validation; }
    this.mempool.push(transaction);
    return new Validation()
  }

  getTransaction(hash: string): TransactionSearch {
    if (hash === '-1') {
      return {
        mempoolIndex: -1,
        blockIndex: - 1
      } as TransactionSearch;
    }

    return {
      mempoolIndex: 0,
      transaction: new Transaction()
    } as TransactionSearch;
  }
}
