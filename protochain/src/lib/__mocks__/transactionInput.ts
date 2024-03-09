import Validation from '../validation';
/**
 * Mocked TransactionInput class
 */
export default class TransactionInput {
  fromAddress: string;
  amount: number;
  signature: string;
  previousTx: string;
  /**
   * Cria um novo TransactionInput
   * @param txInput dados do transaction input
   */
  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || "carteira";
    this.amount = txInput?.amount || 10;
    this.signature = txInput?.signature || "abc";
    this.previousTx = txInput?.previousTx || "abx"
  }
  /**
   * Assina o transaction input, para garantir a validade.
   * @param privateKey chave privada do 'from' da transação
   */
  sign(privateKey: string): void {
    this.signature = 'abc';
  }
  /**
   * Gera um hash com os dados da classe
   */
  getHash(): string {
    return 'abc';
  }
  /**
   * Verifica se o TransactionInput é válido
   * @returns Objeto com o resultado das validações
   */
  isValid(): Validation {
    if (!this.previousTx || !this.signature)
      return new Validation(false, 'Signature and previous TX are required.');

    if (this.amount < 1)
      return new Validation(false, 'Amount must be greater than zero.');

    return new Validation();
  }
}