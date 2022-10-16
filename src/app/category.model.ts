import { Util } from "./util.model"


export class Category{

  name!: string
  id!: string
  utils!: Util[]
  cols!: number

  constructor(name: string, id: string, utils: Util[], cols: number){
    this.name = name ?? "New"
    this.id = id
    this.utils = utils ?? []
    this.cols = cols ?? 3
  }
}