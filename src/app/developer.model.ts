import { StoreTheme } from './theme.model';
import { Wallet } from './wallet.model';

export class Developer {
  name!: string;
  id!: string;
  url!: string;
  utils!: Wallet[];
  date!: number;
  email!: string;

  constructor(
    name: string,
    id: string,
    utils: Wallet[],
    date: number,
    url: string,
    email: string,
  ) {
    this.name = name ?? 'New';
    this.id = id;
    this.utils = utils ?? [];
    this.date = date ?? 3;
    this.url = url;
    this.email = email;

  }
}
