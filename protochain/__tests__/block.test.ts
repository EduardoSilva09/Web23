import { describe, test, expect, beforeAll, jest } from "@jest/globals";
import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";
import TransactionInput from "../src/lib/transactionInput";

jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");

describe("Block tests", () => {
  const exampleDifficlty = 0;
  const exampleMiner = "Eduardo";
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)]
    } as Block);
  });

  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)]
    } as Block);
    block.mine(exampleDifficlty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.message).toEqual('');
    expect(valid.success).toBeTruthy();
  });

  test("Should create from block info", () => {
    const block = Block.fromBlockInfo({
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)],
      difficulty: exampleDifficlty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 0,
      previousHash: genesis.hash,
    } as BlockInfo);
    block.mine(exampleDifficlty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeTruthy();
  });

  test("Should be valid (fallbacks)", () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (previous hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "Invalid previous hash",
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)],
    } as Block);
    block.timestamp = -1;
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (no mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)],
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (empty hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)],
    } as Block);
    block.mine(exampleDifficlty, exampleMiner);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (txInput)", () => {
    const txInput = new TransactionInput();
    txInput.amount = -1;

    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInput
      } as Transaction)],
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Too Many Fees)", () => {
    const block = new Block({
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
          type: TransactionType.FEE
        } as Transaction),
        new Transaction({
          txInput: new TransactionInput(),
          type: TransactionType.FEE
        } as Transaction)
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.message).toEqual('Too many fees.');
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Invalid transaction)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput()
        } as Transaction)
      ],
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });
});
