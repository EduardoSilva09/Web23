export default class Block {
  index: number;
  hash: string;

  constructor(index: number, hash: string) {
    this.index = index;
    this.hash = hash;
  }

  isValid(): boolean {
    return !(this.index < 0) && !!this.hash;
  }
}
