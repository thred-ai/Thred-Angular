export class Signature {
  name!: string;
  id!: string;
  pay_address!: string;
  category!: number;
  price!: string;
  created!: number;
  modified!: number;
  chainId!: number;
  signature!: string;

  constructor(
    name: string,
    id: string,
    pay_address: string,
    category: number,
    price: string,
    created: number,
    modified: number,
    chainId: number,
    signature: string
  ) {
    this.name = name ?? 'My SmartUtil';
    this.id = id;
    this.created = created;
    this.modified = modified ?? created;
    this.pay_address = pay_address;
    this.category = category ?? 0;
    this.price = price ?? "";
    this.chainId = chainId ?? 1
    this.signature = signature;
  }
}
