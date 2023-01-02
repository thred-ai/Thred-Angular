import { Bar } from './bar.model';
import { Block } from './block.model';
import { SEO } from './seo.model';
import { Tab } from './tab.model';

export class Page {
  name?: string;
  title?: string;
  img?: string;
  id?: string;
  url?: string;
  fullscreen?: boolean;
  loader?: boolean;
  blocks?: Array<Block>;
  seo?: SEO;
  tab: Tab;
  bar: Bar;
  position: number;
  backgroundColor?: string;
  detailColor?: string;
  icon: string

  constructor(
    name?: string,
    title?: string,
    img?: string,
    id?: string,
    url?: string,
    blocks?: Array<Block>,
    fullscreen?: boolean,
    loader?: boolean,
    seo?: SEO,
    tab?: Tab,
    bar?: Bar,
    position?: number,
    backgroundColor?: string,
    detailColor?: string,
    icon?: string
  ) {
    this.name = name;
    this.title = title;
    this.img = img;
    this.id = id;
    this.url = url;
    this.blocks = blocks ?? [];
    this.fullscreen = fullscreen ?? false;
    this.loader = loader ?? true;
    this.seo = seo;
    this.tab = tab ?? new Tab('#FFFFFF', '#000000', '#000000', 0);
    this.bar = bar ?? new Bar('#FFFFFF', '#000000', '#000000', 0, true)
    this.position = position ?? 0
    this.backgroundColor = backgroundColor ?? '#FFFFFF';
    this.detailColor = detailColor ?? '#000000';
    this.icon = icon ?? 'radio_button_unchecked'
  }
}
