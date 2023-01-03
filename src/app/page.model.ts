import { Bar } from './bar.model';
import { Block } from './block.model';
import { SEO } from './seo.model';
import { Tab } from './tab.model';

export class Page {
  name: string;
  title: string;
  id: string;
  type: number;
  url: string;
  blocks: Array<Block>;
  tab: Tab;
  bar: Bar;
  position: number;
  backgroundColor: string;
  detailColor: string;
  icon: string

  constructor(
    id: string,
    title: string,
    name: string,
    blocks: Array<Block>,
    type?: number,
    url?: string,
    tab?: Tab,
    bar?: Bar,
    position?: number,
    backgroundColor?: string,
    detailColor?: string,
    icon?: string
  ) {
    this.name = name;
    this.title = title ?? 'New Page';
    this.id = id;
    this.type = type ?? 0
    this.url = url ?? '';
    this.blocks = blocks ?? [];
    this.tab = tab ?? new Tab('#FFFFFF', '#000000', '#000000', 0);
    this.bar = bar ?? new Bar('#FFFFFF', '#000000', '#000000', 0, true)
    this.position = position ?? 0
    this.backgroundColor = backgroundColor ?? '#FFFFFF';
    this.detailColor = detailColor ?? '#000000';
    this.icon = icon ?? 'radio_button_unchecked'
  }
}
