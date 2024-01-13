import * as ecc from 'tiny-secp256k1'
import ECPairFactory, { ECPairInterface } from 'ecpair'
import sha256 from 'crypto-js/sha256';
import Validation from './validation';

const ECPair = ECPairFactory(ecc);

export default class TransactionInput {
  fromAddress: string;
  amount: number;
  signature: string;
  /**
   * Cria um novo TransactionInput
   * @param txInput dados do transaction input
   */
  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || "";
    this.amount = txInput?.amount || 0;
    this.signature = txInput?.signature || "";
  }
  /**
   * Assina o transaction input, para garantir a validade.
   * @param privateKey chave privada do 'from' da transação
   */
  sign(privateKey: string): void {
    this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
      .sign(Buffer.from(this.getHash(), 'hex'))
      .toString('hex');
  }
  /**
   * Gera um hash com os dados da classe
   */
  getHash(): string {
    return sha256(this.fromAddress + this.amount).toString();
  }
  /**
   * Verifica se o TransactionInput é válido
   * @returns Objeto com o resultado das validações
   */
  isValid(): Validation {
    if (!this.signature)
      return new Validation(false, 'Signature is required.');

    if (this.amount < 1)
      return new Validation(false, 'Amount must be greater than zero.');

    const hash = Buffer.from(this.getHash(), 'hex');
    const isValid = ECPair.fromPublicKey(Buffer.from(this.fromAddress, 'hex'))
      .verify(hash, Buffer.from(this.signature, 'hex'));

    return isValid ? new Validation() : new Validation(false, 'Invalid tx input Signature.');
  }
}