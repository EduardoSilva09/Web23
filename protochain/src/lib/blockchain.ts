import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionType from "./transactionType";
import TransactionSearch from "./transactionSearch";
import TransactionOutput from "./transactionOutput";
import TransactionInput from "./transactionInput";

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  mempool: Transaction[];
  nextIndex: number = 0;
  static readonly DIFFICULTY_FACTOR = 5;
  static readonly MAX_DIFFICULTY = 62;
  static readonly TX_PER_BLOCK = 2;

  /**
   * Creates a new blockchain
   */
  constructor(miner: string) {
    this.blocks = [] as Block[];
    this.mempool = [] as Transaction[];
    const genesis = this.createGenesis(miner);
    this.blocks.push(genesis);
    this.nextIndex++;
  }

  createGenesis(miner: string): Block {
    const amount = 10;
    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        amount,
        toAddress: miner
      } as TransactionOutput)],
    } as Transaction)

    tx.hash = tx.getHash();
    tx.txOutputs[0].tx = tx.hash;

    const block = new Block();
    block.transactions = [tx];
    block.mine(this.getDifficulty(), miner)
    return block;
  }

  /**
   * Get the last block added
   * @returns Returns the last block added
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  getTransaction(hash: string): TransactionSearch {
    const mempoolIndex = this.mempool.findIndex(tx => tx.hash === hash);
    if (mempoolIndex !== -1) {
      return {
        mempoolIndex,
        transaction: this.mempool[mempoolIndex]
      } as TransactionSearch
    }

    const blockIndex = this.blocks.findIndex(b => b.transactions.some(tx => tx.hash === hash));
    if (blockIndex !== -1) {
      return {
        blockIndex,
        transaction: this.blocks[blockIndex].transactions.find(tx => tx.hash === hash)
      } as TransactionSearch
    }
    return { blockIndex: -1, mempoolIndex: -1 } as TransactionSearch
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR) + 1;
  }

  addTransaction(transaction: Transaction): Validation {
    if (transaction.txInputs && transaction.txInputs.length) {
      const from = transaction.txInputs[0].fromAddress;

      const pendingTx = this.mempool
        .filter(tx => tx.txInputs && tx.txInputs.length)
        .map(tx => tx.txInputs)
        .flat()
        .filter(txi => txi!.fromAddress === from);

      if (pendingTx && pendingTx.length) {
        return new Validation(false, 'This wallet has a pending transaction.');
      }

      const utxo = this.getUtxo(from);
      for (let i = 0; i < transaction.txInputs.length; i++) {
        const txi = transaction.txInputs[i];
        if (utxo.findIndex(txo => txo.tx === txi.previousTx && txo.amount >= txi.amount) === -1) {
          return new Validation(false, 'Invalid transaction: the TXO is already spent or unexistent.');
        }
      }
    }

    const validation = transaction.isValid();
    if (!validation.success)
      return new Validation(false, 'Invalid tx: ' + validation.message);
    //Validando se a transação já foi adicionada  
    if (this.blocks.some(b => b.transactions.some(tx => tx.hash === transaction.hash)))
      return new Validation(false, 'Duplicated tx in blockchain.');

    // if (this.mempool.some(tx => tx.hash = transaction.hash))
    //   return new Validation(false, 'Duplicated tx in mempool.');

    this.mempool.push(transaction);
    return new Validation(true, transaction.hash);
  }

  /**
   * Adds a new block to the blockchain
   * @param block Block to be added
   * @returns Returns true if block is added
   */
  addBlock(block: Block): Validation {
    const nextBlock = this.getNextBlock();
    if (!nextBlock)
      return new Validation(false, 'There is no next block info');

    const validation = block.isValid(
      nextBlock.previousHash,
      nextBlock.index - 1,
      nextBlock.difficulty
    );
    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`);

    //Remover da mempool para não serem reprocessadas
    const txs = block.transactions.filter(tx => tx.type !== TransactionType.FEE).map(tx => tx.hash);
    const newMempool = this.mempool.filter(tx => !txs.includes(tx.hash));

    //Evitar que haja mais transações no bloco do que as que foram entregues pela blockchain
    if (newMempool.length + txs.length !== this.mempool.length)
      return new Validation(false, `Invalid tx in block: mempool`);
    this.mempool = newMempool;

    this.blocks.push(block);
    this.nextIndex++;
    return new Validation(true, block.hash);
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

  getNextBlock(): BlockInfo | null {
    if (!this.mempool || !this.mempool.length)
      return null;

    const transactions = this.mempool.slice(0, Blockchain.TX_PER_BLOCK);
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
      transactions,
    } as BlockInfo;
  }

  getTxInputs(wallet: string): (TransactionInput | undefined)[] {
    return this.blocks
      .map(b => b.transactions)
      .flat()
      .filter(tx => tx.txInputs && tx.txInputs.length > 0)
      .map(tx => tx.txInputs)
      .flat().filter(txi => txi!.fromAddress === wallet);
  }

  getTxOutputs(wallet: string): (TransactionOutput | undefined)[] {
    return this.blocks
      .map(b => b.transactions)
      .flat()
      .filter(tx => tx.txOutputs && tx.txOutputs.length > 0)
      .map(tx => tx.txOutputs)
      .flat().filter(txi => txi!.toAddress === wallet);
  }

  getUtxo(wallet: string): TransactionOutput[] {
    const txIns = this.getTxInputs(wallet);
    const txOuts = this.getTxOutputs(wallet);

    if (!txIns || !txIns.length) return txOuts as TransactionOutput[];

    txIns.forEach(txi => {
      const index = txOuts.findIndex(txo => txo!.amount === txi!.amount);
      txOuts.splice(index, 1);
    })

    return txOuts as TransactionOutput[];
  }

  getBalance(wallet: string): number {
    const utxo = this.getUtxo(wallet);
    if (!utxo || !utxo.length) return 0;
    return utxo.reduce((a, b) => a + b.amount, 0);
  }
}
