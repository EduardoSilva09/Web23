import { describe, test, expect, beforeAll } from "@jest/globals";
import Block from "../src/lib/block";

describe("Block tests", () => {
  const exampleDifficlty = 0;
  const exampleMiner = "Eduardo";
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({ data: "Genesis Block" } as Block);
  });

  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block data",
    } as Block);
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
      data: "block data",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block data",
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
      data: "block data",
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (empty hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block data",
    } as Block);
    block.mine(exampleDifficlty, exampleMiner);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "",
    } as Block);
    block.data = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: "block data",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficlty);
    expect(valid.success).toBeFalsy();
  });
});
