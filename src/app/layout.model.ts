import { Page } from './page.model';

export class Layout {
  name!: string;
  type!: string;
  pages!: Page[];
  id!: string

  constructor(name: string, type: string, pages: Page[], id?: string) {
    this.name = name;
    this.type = type;
    this.pages = pages;
    this.id = id ?? `${new Date().getTime()}`
  }
}
