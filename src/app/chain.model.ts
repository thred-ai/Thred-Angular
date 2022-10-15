

export class Chain{

  name!: string
  id!: number
  url!: string

  constructor(name: string, id: number){
    this.name = name ?? "Ethereum"
    this.id = id ?? 1
    this.url = `https://storage.googleapis.com/clothingapp-ed125.appspot.com/Logos/${id}.png`
  }
}