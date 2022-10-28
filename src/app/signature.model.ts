import { ethers } from "ethers";

export class Signature {
  id!: string;
  signer!: string;
  payAddress!: string;
  feeAddress!: string;
  fee!: number;
  price!: ethers.BigNumber;
  chainId!: number;
  signature!: string;

  constructor(
    id: string,
    signer: string,
    payAddress: string,
    feeAddress: string,
    fee: number,
    price: ethers.BigNumber,
    chainId: number,
    signature: string
  ) {
    this.id = id;
    this.signer = signer;
    this.payAddress = payAddress;
    this.feeAddress = feeAddress;
    this.fee = fee;
    this.price = price;
    this.chainId = chainId;
    this.signature = signature;
  }
}
