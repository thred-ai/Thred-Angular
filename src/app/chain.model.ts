

export class Chain{

  name!: string
  id!: number

  constructor(name: string, id: number){
    this.name = name ?? "Ethereum"
    this.id = id ?? 1
  }
}