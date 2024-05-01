import { describe, test, expect, beforeAll } from "@jest/globals";
import TransactionInput from "../src/lib/transactionInput";
import Wallet from "../src/lib/wallet";
import TransactionOutput from "../src/lib/transactionOutput";

describe("TransactionInput tests", () => {
  let alice: Wallet;
  let johnDoe: Wallet;
  const exampleTx: string = "5df341f250102c2ead21";

  beforeAll(() => {
    alice = new Wallet();
    johnDoe = new Wallet();
  });

  test("Should be valid", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput);

    txInput.sign(alice.privateKey);
    const valid = txInput.isValid();

    expect(valid.message).toEqual('');
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (Empty signature)", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput);

    const valid = txInput.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Invalid amount)", () => {
    const txInput = new TransactionInput({
      amount: -1,
      fromAddress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput);

    txInput.sign(alice.privateKey);
    const valid = txInput.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Invalid signature)", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput);
    txInput.sign(johnDoe.privateKey);
    const valid = txInput.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Defaults)", () => {
    const txInput = new TransactionInput();
    txInput.sign(johnDoe.privateKey);
    const valid = txInput.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Incalid previousTX)", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey
    } as TransactionInput);
    txInput.sign(alice.privateKey);
    const valid = txInput.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should create from TXO ", () => {
    const txi = TransactionInput.fromTXO({
      amount: 10,
      toAddress: alice.publicKey,
      tx: exampleTx
    } as TransactionOutput)

    txi.sign(alice.privateKey);
    txi.amount = 11;
    const valid = txi.isValid();
    expect(valid.success).toBeFalsy();
  });
});
