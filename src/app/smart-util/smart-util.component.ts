import { ENTER, COMMA, T } from '@angular/cdk/keycodes';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ethers } from 'ethers';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddressEnsLookupPipe } from '../address-ens-lookup.pipe';
import { AddressValidatePipe } from '../address-validate.pipe';
import { Chain } from '../chain.model';
import { LayoutBuilderComponent } from '../layout-builder/layout-builder.component';
import { Layout } from '../layout.model';
import { LoadService } from '../load.service';
import { NameEnsLookupPipe } from '../name-ens-lookup.pipe';
import { Signature } from '../signature.model';
import { Wallet } from '../wallet.model';

@Component({
  selector: 'app-smart-util',
  templateUrl: './smart-util.component.html',
  styleUrls: ['./smart-util.component.scss'],
})
export class SmartUtilComponent implements OnInit, OnDestroy {
  wallet?: Wallet;
  imgs: {
    coverFile?: File;
    logoFile?: File;
  } = {};
  selectedIndex = 0;

  layouts = ['desktop', 'mobile'];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loadService: LoadService,
    public dialogRef: MatDialogRef<SmartUtilComponent>,
    @Inject(PLATFORM_ID) private platformID: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.filteredAddresses = this.addressCtrl.valueChanges.pipe(
      startWith(null),
      map((address: string | null) =>
        address ? this._filter(address) : this.addresses.slice()
      )
    );
  }

  ngOnDestroy(): void {
    window.onclick = null;
  }
  async ngOnInit() {
    this.mode = this.data.mode ?? 0;
    let app = this.data.wallet as Wallet;

    console.log(app);
    if (app) {
      this.wallet = app;

      this.selectedUsers = (await this.getENS(app.whitelist ?? [])) ?? [];

      this.loadService.loadedChains.subscribe((chains) => {
        this.categories[0].chains = chains ?? [];

        var chains: any[] = [];

        this.categories.forEach((c) => {
          c.chains.forEach((a) => {
            if (app.chains.find((x) => x.id == a.id)) {
              chains.push(a);
            }
          });
        });
        this.wallet!.chains = chains;
      });
    } else {
      this.loadService.loadedChains.subscribe((chains) => {
        this.categories[0].chains = chains ?? [];
      });

      // this.utilForm.controls['appImg'].setValue(
      //   'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_smartutil_app.png'
      // );
      // this.utilForm.controls['marketingImg'].setValue(
      //   'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_smartutil_marketing.png'
      // );
      this.wallet = new Wallet(
        this.loadService.newUtilID,
        '',
        0,
        undefined,
        undefined,
        undefined,
        'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_smartutil_app.png',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [this.categories[0].chains[0]],
        'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_smartutil_marketing.png',
        0,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }

    this.cdr.detectChanges();

    window.onclick = (e) => {
      if ((e.target as any)?.id == 'removeBtn') {
        return;
      }

      if (isPlatformBrowser(this.platformID)) {
        this.selectedUsers.forEach((_, index: number) => {
          if (document.getElementsByClassName(`menu-${index}`).length > 0) {
            (
              Object.values(
                document.getElementsByClassName(`close-${index}`)
              )[0] as HTMLElement
            )?.click();
          }
        });
      }
    };
  }

  sameLayouts() {
    return (
      (this.wallet?.layouts[0]?.pages ?? []) ==
        (this.wallet?.layouts[1]?.pages ?? []) ?? false
    );
  }

  syncLayouts(id: string) {
    let layout =
      this.wallet?.layouts.find((layout) => layout.type == id)?.pages ?? [];
    if (id == 'mobile') {
      this.wallet!.layouts[0].pages = layout;
    } else if (id == 'desktop') {
      this.wallet!.layouts[1].pages = layout;
    }
  }

  // utilForm = this.fb.group({
  //   name: [null, Validators.required],
  //   description: [null, Validators.required],
  //   networks: [[], Validators.required],

  //   appImg: [null, Validators.required],
  //   marketingImg: [null, Validators.required],

  //   installWebhook: [null],
  //   appFile: [null],
  //   marketingFile: [null],
  //   available: [true],
  //   authStyle: [1, Validators.required],
  //   tracking: [false, Validators.required],
  //   displayedLayouts: [[], Validators.required],

  // });

  loading = false;
  mode = 0;

  customCurrencyMaskConfig = {
    align: 'left',
    allowNegative: false,
    allowZero: false,
    decimal: '.',
    precision: 1,
    prefix: '',
    suffix: '',
    thousands: ',',
    min: 0,
    inputMode: CurrencyMaskInputMode.NATURAL,
  };

  categories: {
    name: string;
    chains: Chain[];
  }[] = [
    {
      name: 'Mainnets',
      chains: [],
    },
  ];

  authCategories: {
    name: string;
    methods: any[];
  }[] = [
    {
      name: 'Simple',
      methods: [
        {
          name: 'Email/Password',
          id: 1,
        },
      ],
    },
    {
      name: 'Web3',
      methods: [
        {
          name: 'Private Key/Secret Phrase',
          id: 2,
        },
      ],
    },
  ];

  // {
  //   name: 'Testnets',
  //   chains: [
  //     new Chain('Ethereum Goerli', 5, 'ETH', 0),
  //     new Chain('Polygon Mumbai', 80001, 'MATIC', 0),
  //   ],
  // },

  selectedUsers: string[] = [];

  selectable = true;
  removable = true;
  addressCtrl = new FormControl();
  filteredAddresses: Observable<any[]>;
  addresses: any[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('addressInput') addressInput?: ElementRef<HTMLInputElement>;

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedUsers.push(event.option.value);

    this.addressInput!.nativeElement.value = '';

    this.addressCtrl.setValue(null);
  }

  // composeWallet() {
  //   let name = this.utilForm.controls['name'].value;
  //   let id = this.wallet?.id ?? this.loadService.newUtilID;
  //   console.log(id);

  //   let chains = (this.utilForm.controls['networks'].value as Chain[]) ?? [];

  //   let created = this.wallet?.created ?? new Date().getTime();
  //   let modified = created;

  //   let available = this.utilForm.controls['available'].value ?? false;
  //   let status = available ? 0 : 1;

  //   let creatorName = '';
  //   let displayUrl: string = this.utilForm.controls['appImg'].value;
  //   let coverUrl: string = this.utilForm.controls['marketingImg'].value;
  //   let description = this.utilForm.controls['description'].value;

  //   let verified = false;

  //   let reviews = 0;
  //   let rating = 0;
  //   let downloads = this.wallet?.downloads ?? 0;

  //   let installWebhook = this.utilForm.controls['installWebhook'].value;
  //   let whitelist = this.selectedUsers ?? [];
  //   let authStyle = this.utilForm.controls['authStyle'].value;
  //   let tracking = this.utilForm.controls['tracking'].value;
  //   let displayedLayouts = this.utilForm.controls['displayedLayouts'].value;

  //   return new Wallet(
  //     id,
  //     '',
  //     created,
  //     modified,
  //     creatorName,
  //     name,
  //     displayUrl,
  //     description,
  //     verified,
  //     reviews,
  //     rating,
  //     downloads,
  //     chains,
  //     coverUrl,
  //     status,
  //     installWebhook,
  //     whitelist,
  //     authStyle,
  //     this.wallet?.layouts,
  //     tracking,
  //     displayedLayouts
  //   );
  // }

  private _filter(value: string): any[] {
    console.log(value);
    const filterValue = value.toLowerCase();

    let newAddresses = this.addresses.filter((p) =>
      p.toLowerCase().includes(filterValue)
    );

    var returnArr = new Array<any>();

    newAddresses.forEach((p) => {
      returnArr.push(p);
    });

    return returnArr;
  }

  async add(event: MatChipInputEvent, authStyle: number) {
    const value = event.value || '';

    if (authStyle == 1) {
      this.selectedUsers.push(value);
    } else if (authStyle == 2) {
      this.selectedUsers.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.addressCtrl.setValue(null);
  }

  async checkValidAddress(address: string, chain = 1) {
    let ensPipe = new NameEnsLookupPipe(this.loadService, this.platformID);
    let addressPipe = new AddressValidatePipe(this.platformID);

    let validAddress = addressPipe.transform(address);
    let validName = await ensPipe.transform(address);

    let isValid =
      chain == 1 ? (validAddress ? validAddress : validName) : validAddress;

    return isValid;
  }

  async getAddresses(finalAddresses = this.selectedUsers ?? []) {
    let addresses: string[] = [];

    let ensPipe = new NameEnsLookupPipe(this.loadService, this.platformID);

    await Promise.all(
      finalAddresses.map(async (f) => {
        var address: string | null = null;

        try {
          address = ethers.utils.getAddress(f);
        } catch (error) {
          address = await ensPipe.transform(f);
        }

        if (address) {
          addresses.push(address);
        }
      })
    );

    return addresses;
  }

  async getENS(finalAddresses = this.selectedUsers ?? []) {
    let addresses: string[] = [];

    let ensPipe = new AddressEnsLookupPipe(this.loadService, this.platformID);

    await Promise.all(
      finalAddresses.map(async (f) => {
        var address: string | null = null;

        try {
          address = (await ensPipe.transform(f)) ?? f;
          console.log(address);
        } catch (error) {
          address = ethers.utils.getAddress(f);
        }

        if (address) {
          addresses.push(address);
        }
      })
    );

    return addresses;
  }

  remove(address: string, authStyle: number): void {
    if (authStyle == 1) {
      const index = this.selectedUsers.indexOf(address);

      if (index >= 0) {
        this.selectedUsers.splice(index, 1);
      }
    } else if (authStyle == 2) {
      const index = this.selectedUsers.indexOf(address);

      if (index >= 0) {
        this.selectedUsers.splice(index, 1);
      }
    }
  }

  async fileChangeEvent(event: any, type = 0): Promise<void> {
    console.log(event);

    let file = event.target.files[0];

    let buffer = await file.arrayBuffer();

    var blob = new Blob([buffer]);

    var reader = new FileReader();
    reader.onload = (event: any) => {
      var base64 = event.target.result;
      if (type == 0) {
        this.wallet!.coverUrl = base64;
        this.imgs.coverFile = file;
      } else if (type == 1) {
        this.wallet!.displayUrl = base64;
        this.imgs.logoFile = file;
      }
    };

    reader.readAsDataURL(blob);
  }

  chains(networks: Chain[]) {
    return networks.map((c) => c.name).join(', ');
  }

  displayedLayouts(layouts: string[]) {
    return layouts.join(', ');
  }

  method(id: number) {
    return (
      this.authCategories.flatMap((c) => c.methods).find((m) => m.id == id)
        ?.name ?? ''
    );
  }

  get isValid(): boolean {
    if (this.wallet) {
      let textFields = ['name', 'displayUrl', 'coverUrl', 'description'] as (
        | 'name'
        | 'displayUrl'
        | 'coverUrl'
        | 'description'
      )[];

      let arrayFields = ['displayedLayouts', 'chains'] as (
        | 'displayedLayouts'
        | 'chains'
      )[];

      let invalidText =
        textFields.map(
          (field) =>
            this.wallet![field] == undefined ||
            this.wallet![field] == null ||
            this.wallet![field]?.trim() == ''
        ).length > 0;

      let invalidArray =
        arrayFields.map(
          (field) =>
            this.wallet![field] == undefined ||
            this.wallet![field] == null ||
            (this.wallet![field]?.length ?? 0) == 0
        ).length > 0;

      return invalidText && invalidArray;
    }

    return false;
  }

  async save() {
    if (this.wallet && this.isValid) {
      this.loading = true;

      try {
        let wallet = this.wallet;
        let appFile = this.imgs.logoFile;
        let marketingFile = this.imgs.coverFile;

        this.loadService.saveSmartUtil(
          wallet,
          (result) => {
            console.log(result);
            this.loading = false;
            this.dialogRef.close(wallet);
          },
          appFile,
          marketingFile
        );
      } catch (error) {
        this.loading = false;
      }
    } else {
      console.log('masuk');
    }
  }

  @ViewChild('layoutBuilder') layoutBuilder?: LayoutBuilderComponent;
  saves: number[] = [];
  loadingMode = 0;

  layoutSaved(data: { time: number; layout?: Layout }) {
    if (data.time) {
      if (data.layout) {
        let i = this.saves.indexOf(data.time);
        if (i > -1) {
          this.saves.splice(i, 1);
        }
        let index =
          this.wallet?.layouts.findIndex(
            (l) => l.name.toLowerCase() == data.layout!.name.toLowerCase()
          ) ?? -1;
        this.loading = false;
        if (this.wallet && index > -1) {
          this.wallet.layouts[index] = data.layout;
          //toast
          if (this.saves.length == 0) {
            this.loadingMode = 0;
          }
        }
      } else {
        this.loadingMode = 1;
        this.saves.push(data.time);
      }
    }
  }

  sendTestHook(hook: string, type = 0) {
    this.loadService.sendTestWebhook(hook, type, 1, 'ethereum');
  }

  contains(chain: Chain) {
    return (
      ((this.wallet?.chains as Chain[]) ?? []).findIndex(
        (n) => n.id == chain.id
      ) >= 0
    );
  }

  containsLayout(layout: string) {
    return (
      ((this.wallet?.displayedLayouts as string[]) ?? []).findIndex(
        (n) => n == layout
      ) >= 0
    );
  }

  close() {
    this.dialogRef.close();
  }

  async changed(event: MatSelectChange) {
    if (event.value.length == 0) {
      event.source.writeValue(this.wallet!.chains)
      return undefined
    }
    this.wallet!.chains = event.value;

    return undefined;
  }

  async layoutChanged(event: MatSelectChange) {
    if (event.value.length == 0) {
      event.source.writeValue(this.wallet!.displayedLayouts)
      return undefined
    }
    this.wallet!.displayedLayouts = event.value;

    return undefined;
  }

  async authChanged(event: MatSelectChange) {
    this.selectedUsers = [];
    this.selectedUsers = [];
    this.wallet!.status = 0;
  }

  async networkChanged(event: MatSelectChange) {
    return undefined;
  }
}
