export class Signature {
  name!: string;
  id!: string;
  signer!: string;
  payAddress!: string;
  appFeeAddress!: string;
  appFee!: string;
  category!: number;
  price!: string;
  created!: number;
  chainId!: number;
  signature!: string;

  constructor(
    name: string,
    id: string,
    signer: string,
    payAddress: string,
    appFeeAddress: string,
    appFee: string,
    category: number,
    price: string,
    created: number,
    chainId: number,
    signature: string
  ) {
    this.name = name;
    this.id = id;
    this.signer = signer;
    this.payAddress = payAddress;
    this.appFeeAddress = appFeeAddress;
    this.appFee = appFee;
    this.category = category;
    this.price = price;
    this.created = created;
    this.chainId = chainId;
    this.signature = signature;
  }
}
