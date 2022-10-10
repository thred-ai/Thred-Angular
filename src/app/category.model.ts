import { Util } from "./util.model"


export class Category{

  name!: string
  id!: number
  utils!: Util[]
  cols!: number

  constructor(name: string, id: number, utils: Util[], cols: number){
    this.name = name ?? "New"
    this.id = id ?? 1
    this.utils = utils ?? []
    this.cols = cols ?? 3
  }
}