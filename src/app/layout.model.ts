import { Page } from './page.model';

export class Layout {
  name!: string;
  type!: string;
  pages!: Page[];

  constructor(name: string, type: string, pages: Page[]) {
    this.name = name;
    this.type = type;
    this.pages = pages;
  }
}
