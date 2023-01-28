import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { App, NFT, NFTList } from 'thred-core';
import { LoadService } from '../load.service';

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.scss'],
})
export class AddAppComponent implements OnInit {
  @Input() data?: any;
  @Input() id?: string;

  @Output() saved = new EventEmitter<{ app: App } | '0'>();

  app?: App;
  chains?: any;
  chainList?: any[];

  constructor(private loadService: LoadService) {}

  async ngOnInit() {
    let app = this.data as App;
    this.app =
      app ??
      new App(
        `${new Date().getTime()}`,
        '',
        '',
        'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default-app.png',
        '',
        true,
        '',
        ''
      );

      this.loadService.loadedChains.subscribe((chains) => {
        this.chains = {};
        chains.forEach((chain) => {
          console.log(chain);
          this.chains[chain.id] = chain;
        });
        this.chainList = chains ?? [];
      });
  }

  loading = false;
  err: string = '';

  imgs: {
    coverFile?: File;
    logoFile?: File;
  } = {};

  async fileChangeEvent(event: any, type = 0): Promise<void> {
    console.log(event);

    let file = event.target.files[0];

    let buffer = await file.arrayBuffer();

    var blob = new Blob([buffer]);

    var reader = new FileReader();
    reader.onload = (event: any) => {
      var base64 = event.target.result;
      if (type == 0) {
        this.app!.coverUrl = base64;
        this.imgs.coverFile = file;
      } else if (type == 1) {
        this.app!.displayUrl = base64;
        this.imgs.logoFile = file;
      }
    };

    reader.readAsDataURL(blob);
  }

  async save() {
    let name = this.app?.name?.trim() ?? '';
    let url = this.app?.loadURL?.trim();
    this.err = '';
    if (this.app && name != '' && url != '' && this.id) {
      this.loading = true;
      try {
        let url = this.imgs.logoFile
          ? await this.loadService.updateAppImage(
              this.id,
              this.app.id,
              this.imgs.logoFile
            )
          : this.app.displayUrl;

        this.loading = false;

        if (url) {
          this.app.displayUrl = url;
          this.finish(this.app);
        } else {
          this.err = 'Something went wrong.';
        }

        // this.loadService.loadNFTs(
        //   new NFTList(0, [this.nft], undefined),
        //   (nfts) => {
        //     this.loading = false;
        //     let nft = nfts[0];
        //     if (nft && nft.title != '' && nft.img != '') {
        //       this.finish(nft);
        //     } else {
        //       this.err = 'NFT does not exist.';
        //     }
        //     console.log(nfts);
        //   }
        // );
      } catch (error) {
        this.loading = false;
      }
    }
  }

  finish(app: App) {
    this.saved.emit({ app });
  }

  delete() {
    this.saved.emit('0');
  }

  // contains(chain: Chain) {
  //   return (
  //     ((this.utilForm.controls['networks'].value as Chain[]) ?? []).findIndex(
  //       (n) => n.id == chain.id
  //     ) >= 0
  //   );
  // }
}
