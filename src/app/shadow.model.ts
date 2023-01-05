export class Shadow {
  color: string;
  blur: number;

  direction: {
    vertical: number;
    horizontal: number;
  };

  constructor(
    color?: string,
    blur?: number,
    direction?: {
      vertical: number;
      horizontal: number;
    }
  ) {
    this.color = color ?? '#000000';
    this.blur = blur ?? 1;
    this.direction = direction ?? {
      vertical: 0,
      horizontal: 0,
    };
  }
}
