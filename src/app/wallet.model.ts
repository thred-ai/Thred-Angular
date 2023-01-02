import { ethers } from 'ethers';
import { Chain } from './chain.model';
import { Layout } from './layout.model';
import { Page } from './page.model';
import { Block } from './block.model';
import { Signature } from './signature.model';
import { StoreTheme } from './theme.model';
import { NFTList } from './nft-list.model';
import { NFT } from './nft.model';
import { NftTokenType } from 'alchemy-sdk';

export class Wallet {
  name!: string;
  id!: string;
  creatorId!: string;
  creatorName?: string;
  displayUrl!: string;
  coverUrl?: string;
  description?: string;
  verified!: boolean;
  reviews!: number;
  rating!: number;
  downloads!: number;
  chains!: Chain[];
  created!: number;
  modified!: number;
  status!: number;
  installWebhook!: string;
  whitelist?: string[];

  layouts!: Layout[];
  authStyle!: number;

  constructor(
    id: string,
    creatorId: string,
    created: number,
    modified?: number,
    creatorName?: string,
    name?: string,
    displayUrl?: string,
    description?: string,
    verified?: boolean,
    reviews?: number,
    rating?: number,
    downloads?: number,
    chains?: Chain[],
    coverUrl?: string,
    status?: number,
    installWebhook?: string,
    whitelist?: string[],
    authStyle?: number,
    layouts?: Layout[]
  ) {
    this.id = id;
    this.creatorId = creatorId;
    this.created = created;
    this.modified = modified ?? created;
    this.creatorName = creatorName ?? 'Unknown Developer';
    this.name = name ?? 'My App';
    this.displayUrl = displayUrl ?? 'add_thred_default_later';
    this.description = description ?? 'No Description Available';
    this.verified = verified ?? false;
    this.reviews = reviews ?? 0;
    this.rating = rating ?? 0;
    this.downloads = downloads ?? 0;
    this.chains = chains ?? [new Chain('Ethereum', 1, 'ETH', 0)];
    this.coverUrl = coverUrl;
    this.status = status ?? 0;
    this.installWebhook = installWebhook ?? '';
    this.whitelist = whitelist ?? [];
    this.authStyle = authStyle ?? 1;

    // this.colorStyle =
    //   colorStyle && (colorStyle?.name ?? '').trim() != ''
    //     ? colorStyle
    //     : new StoreTheme(
    //         'Light',
    //         'light',
    //         'dark',
    //         'light',
    //         'simple',
    //         [255.0, 255.0, 255.0, 1],
    //         [10.0, 10.0, 10.0, 1]
    //       );

    let pages = [
      new Page('home', 'Home', undefined, '1', 'home', []),
    ];

    this.layouts = layouts ?? [
      new Layout('Desktop', 'desktop', pages),
      new Layout('Mobile', 'mobile', pages),
    ];
  }
}
