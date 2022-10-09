export class Signature {
  name!: string;
  id!: string;
  pay_address!: string;
  category!: number;
  price!: number;
  signature!: string;

  constructor(
    name: string,
    id: string,
    pay_address: string,
    category: number,
    price: number,
    signature: string
  ) {
    this.name = name ?? 'My SmartUtil';
    this.id = id;
    this.pay_address = pay_address;
    this.category = category ?? 0;
    this.price = price ?? 0;
    this.signature = signature;
  }
}
