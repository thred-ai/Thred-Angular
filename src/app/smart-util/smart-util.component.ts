import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ethers } from 'ethers';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { Chain } from '../chain.model';
import { LoadService } from '../load.service';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-smart-util',
  templateUrl: './smart-util.component.html',
  styleUrls: ['./smart-util.component.scss'],
})
export class SmartUtilComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loadService: LoadService,
    public dialogRef: MatDialogRef<SmartUtilComponent>,
    private cdr: ChangeDetectorRef
  ) {
    let app = this.data.util as Util;
    console.log(app);
    if (app) {
      this.utilForm.controls['name'].setValue(app.name);
      this.utilForm.controls['description'].setValue(app.description);
      this.utilForm.controls['price'].setValue(app.price);

      var chains: Chain[] = [];

      this.categories.forEach((c) => {
        c.chains.forEach((a) => {
          if (app.chains.find((x) => x.id == a.id)) {
            chains.push(a);
          }
        });
      });
      this.utilForm.controls['networks'].setValue(chains);

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
  }
  ngOnInit(): void {
    this.cdr.detectChanges();
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
  });

  loading = false;

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

        chains.forEach((chain) => {
          signatures.push(
            new Signature(id, '', wallet, '', extraFee, ethPrice, chain.id, '')
          );
        });

        let creatorName = '';
        let displayUrls: string[] = [this.utilForm.controls['appImg'].value];
        let coverUrl: string = this.utilForm.controls['marketingImg'].value;
        let metaUrl = '';
        let description = this.utilForm.controls['description'].value;

        let available = true;
        let verified = false;

        let reviews = 0;
        let rating = 0;
        let downloads = this.data.util?.downloads ?? 0;

        let status = this.data.util?.status ?? 0;
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
          loadURL
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
}
