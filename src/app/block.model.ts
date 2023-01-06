import { Border } from './border.model';
import { Grid } from './grid.model';
import { NFTList } from './nft-list.model';
import { Shadow } from './shadow.model';

export class Block {
  nftList: NFTList;
  type: number;
  imgs: string[];
  grid: Grid;
  html: string;
  backgroundColor: string;
  corners: number;
  animations: string;
  vids: string[];
  htmlTemplate: string;
  fontName: string;
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  detailColor: string;
  textColor: string;
  borders: {
    left: Border;
    right: Border;
    top: Border;
    bottom: Border;
  };
  shadow: Shadow;

  constructor(
    nftList?: NFTList,
    type?: number,
    imgs?: string[],
    grid?: Grid,
    html?: string,
    backgroundColor?: string,
    corners?: number,
    animations?: string,
    vids?: string[],
    htmlTemplate?: string,
    fontName?: string,
    padding?: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    },
    detailColor?: string,
    textColor?: string,
    borders?: {
      left: Border;
      right: Border;
      top: Border;
      bottom: Border;
    },
    shadow?: Shadow
  ) {
    this.nftList = nftList ?? new NFTList(0, []);
    this.type = type ?? 0;
    this.imgs = imgs ?? [];
    // this.grid_row = grid_row ?? 0;
    // this.grid_alignment = grid_alignment ?? 'start';
    this.grid = grid ?? new Grid(0, 3, 0, 'start');
    this.html = html ?? '';
    this.backgroundColor = backgroundColor ?? '';
    this.corners = corners ?? 0;
    this.animations = animations ?? '';
    this.vids = vids ?? [];
    this.htmlTemplate = htmlTemplate ?? '';
    this.fontName = fontName ?? 'Montserrat';
    this.padding = padding ?? {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    this.detailColor = detailColor ?? '#000000';
    this.textColor = textColor ?? '#000000';

    this.borders = borders ?? {
      left: new Border('left', '#000000', 1),
      right: new Border('right', '#000000', 1),
      top: new Border('top', '#000000', 1),
      bottom: new Border('bottom', '#000000', 1),
    };

    this.shadow = shadow ?? new Shadow('#000000', 0);
  }
}
