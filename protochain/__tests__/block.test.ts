import { describe, test, expect, beforeAll, jest } from "@jest/globals";
import Block from "../src/lib/block";
import BlockInfo from "../src/lib/blockInfo";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";
import TransactionInput from "../src/lib/transactionInput";
import TransactionOutput from "../src/lib/transactionOutput";
import Wallet from "../src/lib/wallet";

jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");
jest.mock("../src/lib/transactionOutput");

describe("Block tests", () => {
  const exampleDifficlty = 1;
  let genesis: Block;
  let alice: Wallet;

  beforeAll(() => {
    alice = new Wallet()
    genesis = new Block({
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);
  });

  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);

    const txo = new TransactionOutput({
      toAddress: alice.publicKey,
      amount: 1
    } as TransactionOutput);

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [txo],
    } as Transaction)

    block.transactions.push(tx);
    block.hash = block.getHash();
    block.mine(exampleDifficlty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (no fee)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);
    block.mine(exampleDifficlty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should create from block info", () => {
    const block = Block.fromBlockInfo({
      transactions: [],
      difficulty: exampleDifficlty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 0,
      previousHash: genesis.hash,
    } as BlockInfo);

    const txo = new TransactionOutput({
      toAddress: alice.publicKey,
      amount: 1
    } as TransactionOutput)

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [txo]
    } as Transaction);

    block.transactions.push(tx);
    block.hash = block.getHash();
    block.mine(exampleDifficlty, alice.publicKey);

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
        txInputs: [new TransactionInput()]
      } as Transaction)],
    } as Block);
    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput(
        { toAddress: alice.publicKey } as TransactionOutput
      )],
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficlty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid ( invalid timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);
    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput(
        { toAddress: alice.publicKey } as TransactionOutput
      )],
      type: TransactionType.FEE
    } as Transaction));

    block.timestamp = -1;
    block.hash = block.getHash();
    block.mine(exampleDifficlty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (no mined)", () => {
    const block = new Block({
      index: 1,
      nonce: 0,
      miner: alice.publicKey,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);
    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput(
        { toAddress: alice.publicKey } as TransactionOutput
      )],
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (empty hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);
    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput(
        { toAddress: alice.publicKey } as TransactionOutput
      )],
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficlty, alice.publicKey);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (invalid tx)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput(
        { toAddress: alice.publicKey } as TransactionOutput
      )],
      timestamp: -1,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficlty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)],
    } as Block);
    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficlty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Too Many Fees)", () => {
    const block = new Block({
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInputs: [new TransactionInput()],
          type: TransactionType.FEE
        } as Transaction),
        new Transaction({
          txInputs: [new TransactionInput()],
          type: TransactionType.FEE
        } as Transaction)
      ],
    } as Block);
    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();
    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();
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
          txInputs: [new TransactionInput()]
        } as Transaction)
      ],
    } as Block);

    block.transactions.push(new Transaction({
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });
});
