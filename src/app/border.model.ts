export class Border {
  name: string;
  color: string;
  width: number;

  constructor(name?: string, color?: string, width?: number) {
    this.name = name ?? '';
    this.color = color ?? '#000000';
    this.width = width ?? 1;
  }
}
