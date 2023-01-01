
export class MetaTag {
  title: string
  description: string
  url: string
  pic: string


  constructor(
    title?: string,
    description?: string,
    url?: string,
    pic?: string
  ) {

    this.title = title ?? ""
    this.description = description ?? ""
    this.url = url ?? ""
    this.pic = pic ?? ""
  }
}