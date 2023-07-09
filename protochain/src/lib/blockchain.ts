import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;
  static readonly DIFFICULTY_FACTOR = 5;
  static readonly MAX_DIFFICULTY = 62;

  /**
   * Creates a new blockchain
   */
  constructor() {
    this.blocks = [
      new Block({ index: this.nextIndex, data: "Genesis Block" } as Block),
    ];
    this.nextIndex++;
  }

  /**
   * Get the last block added
   * @returns Returns the last block added
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
  }

  /**
   * Adds a new block to the blockchain
   * @param block Block to be added
   * @returns Returns true if block is added
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();
    const validation = block.isValid(
      lastBlock.hash,
      lastBlock.index,
      this.getDifficulty()
    );
    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`);

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
    return this.blocks.find((b) => b.hash === hash);
  }

  /**
   * Validates the blockchain
   * @returns Returns true if the blockchain is valid
   */
  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index,
        this.getDifficulty()
      );
      if (!validation.success)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`
        );
    }
    return new Validation();
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
    const data = new Date().toString();
    const difficulty = this.getDifficulty();
    const previousHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const maxDifficulty = Blockchain.MAX_DIFFICULTY;

    return {
      index,
      previousHash,
      difficulty,
      maxDifficulty,
      feePerTx,
      data,
    } as BlockInfo;
  }
}
