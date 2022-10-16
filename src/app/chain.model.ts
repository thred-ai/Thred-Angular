

export class Chain{

  name!: string
  id!: number
  url!: string

  constructor(name: string, id: number){
    this.name = name ?? "Ethereum"
    this.id = id ?? 1
    this.url = `https://storage.googleapis.com/thred-protocol.appspot.com/chain-icons/${id}.png`
  }
}