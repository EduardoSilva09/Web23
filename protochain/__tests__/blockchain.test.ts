import { describe, test, expect, jest } from "@jest/globals";
import Blockchain from "../src/lib/blockchain";
import Block from "../src/lib/block";
import Transaction from "../src/lib/transaction";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");

describe("Block tests", () => {
  test("Should be has genesis block", () => {
    const blockchain = new Blockchain();
    expect(blockchain.blocks.length).toEqual(1);
  });

  test("Should be valid (genesis)", () => {
    const blockchain = new Blockchain();
    expect(blockchain.isValid().success).toEqual(true);
  });

  test("Should NOT be valid", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: 'TX1'
    } as Transaction);

    blockchain.mempool.push(tx);

    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );
    blockchain.blocks[1].index = -1;
    expect(blockchain.isValid().success).toEqual(false);
  });

  test("Should add block", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: 'TX1'
    } as Transaction);

    blockchain.mempool.push(tx);

    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );
    expect(result.success).toEqual(true);
  });

  test("Should NOT add block", () => {
    const blockchain = new Blockchain();
    const result = blockchain.addBlock(
      new Block({
        index: -1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [new Transaction({
          data: 'Block 2'
        } as Transaction)],
      } as Block)
    );
    expect(result.success).toEqual(false);
  });

  test("Should get block", () => {
    const blockchain = new Blockchain();
    const block = blockchain.getBlock(blockchain.blocks[0].hash);
    expect(block).toBeTruthy();
  });

  test("Should be valid block (two blocks)", () => {
    const blockchain = new Blockchain();
    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [new Transaction({
          data: 'Block 2'
        } as Transaction)],
      } as Block)
    );
    expect(blockchain.isValid().success).toEqual(true);
  });

  test("Should get next block info", () => {
    const blockchain = new Blockchain();
    blockchain.mempool.push(new Transaction())
    const info = blockchain.getNextBlock();
    expect(info ? info.index : 0).toEqual(1);
  });

  test("Should NOT get next block info", () => {
    const blockchain = new Blockchain();
    const info = blockchain.getNextBlock();
    expect(info).toBeNull();
  });

  test("Should Add Transaction", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: 'TX1',
      hash: 'zaa'
    } as Transaction);

    const validation = blockchain.addTransaction(tx);
    expect(validation.success).toEqual(true);
  });

  test("Should NOT Add Transaction (Invalid tx)", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: '',
      hash: 'zaa'
    } as Transaction);

    const validation = blockchain.addTransaction(tx);
    expect(validation.success).toEqual(false);
  });

  test("Should NOT Add Transaction (Duplicated in Blockchain)", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: 'tx1',
      hash: 'zaa'
    } as Transaction);

    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block)
    );

    const validation = blockchain.addTransaction(tx);
    expect(validation.success).toEqual(false);
  });

  test("Should NOT Add Transaction (Duplicated in Mempool)", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: 'tx1',
      hash: 'zaa'
    } as Transaction);

    blockchain.mempool.push(tx);

    const validation = blockchain.addTransaction(tx);
    expect(validation.success).toEqual(false);
  });

  test("Should Get Transaction (Mempool)", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: 'TX1',
      hash: 'zaa'
    } as Transaction);

    blockchain.mempool.push(tx);
    const result = blockchain.getTransaction(tx.hash);
    expect(result.mempoolIndex).toEqual(0);
  });

  test("Should Get Transaction (Blockchain)", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      data: 'TX1',
      hash: 'zaa'
    } as Transaction);

    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block)
    );

    const result = blockchain.getTransaction(tx.hash);
    expect(result.blockIndex).toEqual(1);
  });

  test("Should NOT Get Transaction", () => {
    const blockchain = new Blockchain();
    const result = blockchain.getTransaction('hash');
    expect(result.mempoolIndex).toEqual(-1);
    expect(result.blockIndex).toEqual(-1);
    expect(result.transaction).toBeFalsy();
  });
});
