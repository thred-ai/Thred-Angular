export class Chain {
  name!: string;
  id!: number;
  currency!: string;
  url!: string;

  constructor(name: string, id: number, currency: string) {
    this.name = name ?? 'Ethereum';
    this.id = id ?? 1;
    this.currency = currency
    this.url = `https://storage.googleapis.com/thred-protocol.appspot.com/chain-icons/${id}.png`;
  }
}
