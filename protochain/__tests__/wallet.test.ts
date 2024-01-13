import { describe, test, expect, beforeAll } from "@jest/globals";
import Wallet from "../src/lib/wallet.ts";

describe("Wallet tests", () => {
  let alice: Wallet;
  beforeAll(() => {
    alice = new Wallet();
  });

  test("Should be valid", () => {
    const wallet = new Wallet();
    expect(wallet.publicKey).toBeTruthy();
    expect(wallet.privateKey).toBeTruthy();
  });

  test("Should recover wallet (PK)", () => {
    const wallet = new Wallet(alice.privateKey);
    expect(wallet.publicKey).toEqual(alice.publicKey);
  });

  test("Should recover wallet (WIF)", () => {
    const walletImportFormat = '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ';
    const wallet = new Wallet(walletImportFormat);
    expect(wallet.publicKey).toEqual(alice.publicKey);
    expect(wallet.publicKey).toBeTruthy();
    expect(wallet.privateKey).toBeTruthy();
  });
});
