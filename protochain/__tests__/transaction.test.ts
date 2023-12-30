import { describe, test, expect } from "@jest/globals";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";

describe("Transaction tests", () => {

  test("Should be valid (REGULAR default)", () => {
    const tx = new Transaction({
      data: 'tx'
    } as Transaction);

    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeTruthy();
  });

  test("Should be valid (FEE)", () => {
    const tx = new Transaction({
      data: 'tx',
      type: TransactionType.FEE
    } as Transaction);

    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.FEE);
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (invalid Hash)", () => {
    const tx = new Transaction({
      data: "dx",
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: 'abc',
    } as Transaction);

    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (invalid Data)", () => {
    const tx = new Transaction();
    tx.data = '';
    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

});
