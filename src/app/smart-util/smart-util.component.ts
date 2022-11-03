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
import { ethers } from 'ethers';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddressEnsLookupPipe } from '../address-ens-lookup.pipe';
import { AddressValidatePipe } from '../address-validate.pipe';
import { Chain } from '../chain.model';
import { LoadService } from '../load.service';
import { NameEnsLookupPipe } from '../name-ens-lookup.pipe';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-smart-util',
  templateUrl: './smart-util.component.html',
  styleUrls: ['./smart-util.component.scss'],
})
export class SmartUtilComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loadService: LoadService,
    public dialogRef: MatDialogRef<SmartUtilComponent>,
    @Inject(PLATFORM_ID) private platformID: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.mode = this.data.mode ?? 0;
    let app = this.data.util as Util;

    if (app) {
      this.utilForm.controls['name'].setValue(app.name);
      this.utilForm.controls['description'].setValue(app.description);
      this.utilForm.controls['price'].setValue(app.price);
      this.utilForm.controls['available'].setValue(app.available);

      var chains: Chain[] = [];

      this.categories.forEach((c) => {
        c.chains.forEach((a) => {
          if (app.chains.find((x) => x.id == a.id)) {
            chains.push(a);
          }
        });
      });
      this.utilForm.controls['networks'].setValue(chains);
      this.selectedChain = this.loadService.chains.find((c) => c.id == 1);

      this.utilForm.controls['wallet'].setValue(app.signatures[0]?.payAddress);
      this.utilForm.controls['appImg'].setValue(app.displayUrls[0]);
      this.utilForm.controls['marketingImg'].setValue(app.coverUrl);
      this.utilForm.controls['installWebhook'].setValue(app.installWebhook);
      this.utilForm.controls['uninstallWebhook'].setValue(app.uninstallWebhook);
      this.utilForm.controls['loadURL'].setValue(app.loadURL ?? null);
    } else {
      this.utilForm.controls['networks'].setValue([
        this.categories[0].chains[0],
      ]);
      this.utilForm.controls['appImg'].setValue(
        'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_smartutil_app.png'
      );
      this.utilForm.controls['marketingImg'].setValue(
        'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_smartutil_marketing.png'
      );
    }

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
    if (this.data.util) {
      console.log(this.data.util.whitelist)
      this.selectedAddresses = await this.getENS(
        this.data.util.whitelist ?? []
      ) ?? [];
      console.log(this.selectedAddresses)
    }
    window.onclick = (e) => {
      if ((e.target as any)?.id == 'removeBtn') {
        return;
      }

      if (isPlatformBrowser(this.platformID)) {
        this.selectedAddresses.forEach((_, index: number) => {
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

  utilForm = this.fb.group({
    name: [null, Validators.required],
    description: [null, Validators.required],
    price: [null, Validators.required],
    networks: [[], Validators.required],
    wallet: [null, Validators.required],
    appImg: [null, Validators.required],
    marketingImg: [null, Validators.required],
    installWebhook: [null],
    uninstallWebhook: [null],
    loadURL: [null],
    appFile: [null],
    marketingFile: [null],
    available: [false],
  });

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
      chains: [
        new Chain('Ethereum', 1, 'ETH'),
        new Chain('Polygon', 137, 'MATIC'),
      ],
    },
    {
      name: 'Testnets',
      chains: [
        new Chain('Ethereum Goerli', 5, 'ETH'),
        new Chain('Polygon Mumbai', 80001, 'MATIC'),
      ],
    },
  ];

  selectedAddresses: string[] = [];
  selectable = true;
  removable = true;
  addressCtrl = new FormControl();
  filteredAddresses: Observable<any[]>;
  addresses: any[] = [];
  selectedChain?: Chain;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('addressInput') addressInput?: ElementRef<HTMLInputElement>;

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAddresses.push(event.option.value);

    this.addressInput!.nativeElement.value = '';

    this.addressCtrl.setValue(null);
  }

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

  async add(event: MatChipInputEvent) {
    const value = event.value || '';

    this.selectedAddresses.push(value);

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

  async getAddresses(finalAddresses = this.selectedAddresses ?? []) {
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

  async getENS(finalAddresses = this.selectedAddresses ?? []) {
    let addresses: string[] = [];

    let ensPipe = new AddressEnsLookupPipe(this.loadService, this.platformID);

    await Promise.all(
      finalAddresses.map(async (f) => {
        var address: string | null = null;

        try {
          address = await ensPipe.transform(f) ?? f;
          console.log(address)
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

  remove(address: string, isValid: boolean): void {
    const index = this.selectedAddresses.indexOf(address);

    if (index >= 0) {
      this.selectedAddresses.splice(index, 1);
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
        this.utilForm.controls['marketingImg'].setValue(base64);
        this.utilForm.controls[`marketingFile`].setValue(file);
      } else if (type == 1) {
        this.utilForm.controls['appImg'].setValue(base64);
        this.utilForm.controls[`appFile`].setValue(file);
      }
    };

    reader.readAsDataURL(blob);
  }

  chains(networks: Chain[]) {
    return networks.map((c) => c.name).join(', ');
  }

  async save() {
    if (this.utilForm.valid) {
      this.loading = true;

      try {
        let name = this.utilForm.controls['name'].value;
        let id = this.data.util?.id ?? this.loadService.newUtilID;
        let creator = (await this.loadService.currentUser)?.uid!;

        let chains =
          (this.utilForm.controls['networks'].value as Chain[]) ?? [];

        let wallet = this.utilForm.controls['wallet'].value;

        let price = String(this.utilForm.controls['price'].value) as string;

        let ethPrice = ethers.utils.parseEther(price);
        let strPrice = ethers.utils.formatEther(ethPrice);

        let numPrice = Number(strPrice);
        let extraFee = 0;

        let category = 0;

        let signatures: Signature[] = [];

        let created = this.data.util?.created ?? new Date().getTime();
        let modified = created;

        let available = this.utilForm.controls['available'].value ?? false;
        let whitelist = this.selectedAddresses ?? [];

        let addresses = await this.getAddresses(whitelist);

        let status = available ? 0 : 1;

        chains.forEach((chain) => {
          signatures.push(
            new Signature(
              id,
              '',
              wallet,
              '',
              extraFee,
              ethPrice,
              chain.id,
              new Date().getTime(),
              available || addresses.length > 0,
              ''
            )
          );
        });

        let creatorName = '';
        let displayUrls: string[] = [this.utilForm.controls['appImg'].value];
        let coverUrl: string = this.utilForm.controls['marketingImg'].value;
        let metaUrl = '';
        let description = this.utilForm.controls['description'].value;

        let verified = false;

        let reviews = 0;
        let rating = 0;
        let downloads = this.data.util?.downloads ?? 0;

        let installWebhook = this.utilForm.controls['installWebhook'].value;
        let uninstallWebhook = this.utilForm.controls['uninstallWebhook'].value;
        let loadURL = this.utilForm.controls['loadURL'].value ?? null;

        let util = new Util(
          id,
          creator,
          signatures,
          created,
          modified,
          creatorName,
          name,
          displayUrls,
          metaUrl,
          description,
          numPrice,
          ethPrice,
          category,
          available,
          verified,
          reviews,
          rating,
          downloads,
          chains,
          coverUrl,
          status,
          installWebhook,
          uninstallWebhook,
          loadURL,
          addresses
        );

        let appFile = this.utilForm.controls[`appFile`].value;
        let marketingFile = this.utilForm.controls[`marketingFile`].value;

        this.loadService.saveSmartUtil(
          util,
          (result) => {
            console.log(result);
            this.loading = false;
            this.dialogRef.close(util);
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

  sendTestHook(hook: string, type = 0) {
    this.loadService.sendTestWebhook(hook, type, 1, 'ethereum');
  }

  contains(chain: Chain) {
    return (
      ((this.utilForm.controls['networks'].value as Chain[]) ?? []).findIndex(
        (n) => n.id == chain.id
      ) >= 0
    );
  }

  close() {
    this.dialogRef.close();
  }

  async changed(event: MatSelectChange) {
    console.log(event.value);
    this.utilForm.controls['networks'].setValue(event.value);

    return undefined;
  }

  async networkChanged(event: MatSelectChange) {
    this.selectedChain = event.value;
    return undefined;
  }
}
