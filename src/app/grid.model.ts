import { Border } from './border.model';
import { Shadow } from './shadow.model';

export class Grid {
  spacing: number;
  rows: number;
  alignment: string;
  backgroundColor: string;
  detailColor: string;
  textColor: string;
  borders: {
    left: Border;
    right: Border;
    top: Border;
    bottom: Border;
  };
  corners: number
  shadow: Shadow

  constructor(
    spacing?: number,
    rows?: number,
    corners?: number,
    alignment?: string,
    backgroundColor?: string,
    detailColor?: string,
    textColor?: string,
    shadow?: Shadow,
    borders?: {
      left: Border;
      right: Border;
      top: Border;
      bottom: Border;
    }
  ) {
    this.spacing = spacing ?? 0;
    this.rows = rows ?? 2;
    this.corners = corners ?? 0
    this.alignment = alignment ?? 'start';
    this.backgroundColor = backgroundColor ?? '#FFFFFF';
    this.detailColor = detailColor ?? '#000000';
    this.textColor = textColor ?? '#000000';
    this.shadow = shadow ?? new Shadow('#000000', 0)
    this.borders = borders ?? {
      left: new Border('left', '#000000', 1),
      right: new Border('right', '#000000', 1),
      top: new Border('top', '#000000', 1),
      bottom: new Border('bottom', '#000000', 1),
    };
  }
}
