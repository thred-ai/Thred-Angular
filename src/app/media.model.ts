export class Media {
  title: string;
  description: string;
  url: string;
  type: string;
  date: number;
  width: number;
  height: number

  constructor(
    title: string,
    url: string,
    type: string,
    description?: string,
    date?: number,
    width?: number,
  height?: number
  ) {
    this.title = title ?? 'New File';
    this.description = description ?? '';
    this.url = url ?? '';
    this.date = date ?? new Date().getTime();
    this.type = type;
    this.width = width ?? 0
    this.height = height ?? 0
  }
}
