import sha256 from "crypto-js/sha256";
/**
 * Block Class
 */
export default class Block {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: string;

  /**
   * Creates a new block
   * @param index The block index in blockchain
   * @param previousHash The previous block hash
   * @param data The block data
   */
  constructor(index: number, previousHash: string, data: string) {
    this.index = index;
    this.timestamp = Date.now();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.getHash();
  }

  getHash(): string {
    return sha256(
      this.index + this.data + this.timestamp + this.previousHash
    ).toString();
  }

  /**
   * Validates the block
   * @returns Returns true if the block is valid
   */
  isValid(): boolean {
    return (
      !(this.index < 0) &&
      !!this.previousHash &&
      !!this.data &&
      !!this.hash &&
      !(this.timestamp < 1)
    );
  }
}
