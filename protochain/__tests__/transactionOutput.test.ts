import { describe, test, expect, beforeAll } from "@jest/globals";
import TransactionOutput from "../src/lib/transactionOutput";
import Wallet from "../src/lib/wallet";

describe("TransactionOutput tests", () => {
  let alice: Wallet;
  let johnDoe: Wallet;
  beforeAll(() => {
    alice = new Wallet();
    johnDoe = new Wallet();
  });

  test("Should be valid", () => {
    const txOutput = new TransactionOutput({
      amount: 10,
      toAddress: alice.publicKey,
      tx: 'abc'
    } as TransactionOutput);

    const valid = txOutput.isValid();

    expect(valid.message).toEqual('');
    expect(valid.success).toBeTruthy();
  });
});
