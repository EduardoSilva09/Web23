import { describe, test, expect, jest } from "@jest/globals";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";
import TransactionInput from "../src/lib/transactionInput";

jest.mock("../src/lib/transactionInput");

describe("Transaction tests", () => {

  test("Should be valid (REGULAR default)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'CarteiraTo'
    } as Transaction);

    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeTruthy();
  });

  test("Should be valid (FEE)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'CarteiraTo',
      type: TransactionType.FEE
    } as Transaction);

    tx.txInput = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.FEE);
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (invalid Hash)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'CarteiraTo',
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

  test("Should NOT be valid (Invalid txInput)", () => {
    const tx = new Transaction({ to: "carteeeeeira" } as Transaction);

    if (tx.txInput) tx.txInput.amount = -1;
    const valid = tx.isValid();
    expect(tx.type).toEqual(TransactionType.REGULAR);
    expect(valid.success).toBeFalsy();
  });

});
