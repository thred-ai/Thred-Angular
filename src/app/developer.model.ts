import { Util } from "./util.model"


export class Developer{

  name!: string
  id!: string
  url!: string
  utils!: Util[]
  date!: number

  constructor(name: string, id: string, utils: Util[], date: number, url: string){
    this.name = name ?? "New"
    this.id = id
    this.utils = utils ?? []
    this.date = date ?? 3
    this.url = url
  }
}