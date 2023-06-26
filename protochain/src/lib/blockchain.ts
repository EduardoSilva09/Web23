import Block from "./block";
import Validation from "./validation";
/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;

  /**
   * Creates a new blockchain
   */
  constructor() {
    this.blocks = [new Block(this.nextIndex, "", "Genesis Block")];
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
   * Adds a new block to the blockchain
   * @param block Block to be added
   * @returns Returns true if block is added
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();
    const validation = block.isValid(lastBlock.hash, lastBlock.index);
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
        previousBlock.index
      );
      if (!validation.success)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`
        );
    }
    return new Validation();
  }
}
