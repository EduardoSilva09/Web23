import { describe, test, expect, jest, beforeAll } from "@jest/globals";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";
import TransactionInput from "../src/lib/transactionInput";
import TransactionOutput from "../src/lib/transactionOutput";
import Wallet from "../src/lib/wallet";

jest.mock("../src/lib/transactionInput");
jest.mock("../src/lib/transactionOutput");

describe("Transaction tests", () => {
  const exampleDifficulty: number = 1;
  const exampleFee: number = 1;
  const exampleTx: string = "5df341f250102c2ead21";
  let alice: Wallet, bob: Wallet;

  beforeAll(() => {
    alice = new Wallet()
    bob = new Wallet()
  })

  test("Should be valid (REGULAR default)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()]
    } as Transaction);

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (txo hash != tx hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()]
    } as Transaction);

    tx.txOutputs[0].tx = 'invalid tx';

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Input < Output)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput(
        { amount: 1 } as TransactionInput
      )],
      txOutputs: [new TransactionOutput(
        { amount: 2 } as TransactionOutput
      )]
    } as Transaction);

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  });

  test("Should be valid (FEE)", () => {
    const tx = new Transaction({
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE
    } as Transaction);

    tx.txInputs = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(tx.type).toEqual(TransactionType.FEE);
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (invalid Hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: 'abc',
    } as Transaction);

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Invalid to)", () => {
    const tx = new Transaction();
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Invalid txInputs)", () => {
    const tx = new Transaction({
      txOutputs: [new TransactionOutput()],
      txInputs: [new TransactionInput()]
    } as Transaction);
    if (tx.txInputs) tx.txInputs[0].amount = -1;
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

  test("Should get fee", () => {
    const txIn = new TransactionInput({
      amount: 11,
      fromAddress: alice.publicKey,
      previousTx: exampleTx
    } as TransactionInput);
    txIn.sign(alice.privateKey);

    const txOut = new TransactionOutput({
      amount: 10,
      toAddress: bob.publicKey
    } as TransactionOutput);

    const tx = new Transaction({
      txInputs: [txIn],
      txOutputs: [txOut]
    } as Transaction)

    const result = tx.getFee()
    expect(result).toBeGreaterThan(0)
  });

  test("Should get zero fee", () => {
    const tx = new Transaction()
    tx.txInputs = undefined

    const result = tx.getFee()
    expect(result).toEqual(0)
  });

  test("Should create from Reward", () => {
    const tx = Transaction.fromReward({
      amount: 10,
      toAddress: alice.publicKey,
      tx: exampleTx
    } as TransactionOutput)

    const result = tx.isValid(exampleDifficulty, exampleFee)
    expect(result.success).toBeTruthy()
  });

  test("Should NOT br valid (fee excess)", () => {
    const txOut = new TransactionOutput({
      amount: Number.MAX_VALUE,
      toAddress: bob.publicKey
    } as TransactionOutput)

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [txOut]
    } as Transaction)

    const result = tx.isValid(exampleDifficulty, exampleFee)
    expect(result.success).toBeFalsy()
  });

});
