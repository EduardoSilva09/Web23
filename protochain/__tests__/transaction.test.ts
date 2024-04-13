import { describe, test, expect, jest } from "@jest/globals";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";
import TransactionInput from "../src/lib/transactionInput";
import TransactionOutput from "../src/lib/transactionOutput";

jest.mock("../src/lib/transactionInput");
jest.mock("../src/lib/transactionOutput");

describe("Transaction tests", () => {

  test("Should be valid (REGULAR default)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()]
    } as Transaction);

    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (txo hash != tx hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()]
    } as Transaction);

    tx.txOutputs[0].tx = 'invalid tx';

    const valid = tx.isValid();
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

    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should be valid (FEE)", () => {
    const tx = new Transaction({
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE
    } as Transaction);

    tx.txInputs = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid();
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

    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Invalid to)", () => {
    const tx = new Transaction();
    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Invalid txInputs)", () => {
    const tx = new Transaction({
      txOutputs: [new TransactionOutput()],
      txInputs: [new TransactionInput()]
    } as Transaction);
    if (tx.txInputs) tx.txInputs[0].amount = -1;
    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

});
