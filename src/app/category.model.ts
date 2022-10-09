import { Util } from "./util.model"


export class Category{

  name!: string
  id!: number
  utils!: Util[]

  constructor(name: string, id: number, utils: Util[]){
    this.name = name ?? "New"
    this.id = id ?? 1
    this.utils = utils ?? []
  }
}