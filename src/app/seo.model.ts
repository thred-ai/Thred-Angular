import { MetaTag } from './meta-tag.model'

export class SEO {
  title: string
  description: string
  meta?: MetaTag
  keywords: Array<string>
  noIndex: boolean


  constructor(
    title: string,
    description: string,
    meta: MetaTag,
    keywords: Array<string>,
    noIndex: boolean
  ) {

    this.title = title ?? ""
    this.description = description ?? "";
    this.meta = meta;
    this.keywords = keywords ?? []
    this.noIndex = noIndex ?? false;

  }
}