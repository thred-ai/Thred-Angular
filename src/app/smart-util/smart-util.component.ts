import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { Chain } from '../chain.model';

@Component({
  selector: 'app-smart-util',
  templateUrl: './smart-util.component.html',
  styleUrls: ['./smart-util.component.scss'],
})
export class SmartUtilComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SmartUtilComponent>
  ) {
    this.utilForm.controls['networks'].setValue([this.categories[0].chains[0]]);
  }

  utilForm = this.fb.group({
    name: [null, Validators.required],
    description: [null, Validators.required],
    price: [null, Validators.required],
    networks: [[], Validators.required],
    wallet: [null, Validators.required],
    appImg: [
      'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_smartutil_app.png',
      Validators.required,
    ],
    marketingImg: [
      'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_smartutil_marketing.png',
      Validators.required,
    ],
    installWebhook: [null],
    uninstallWebhook: [null],
  });

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
      if (type == 0){
        this.utilForm.controls['marketingImg'].setValue(base64);
      }
      else if (type == 1){
        this.utilForm.controls['appImg'].setValue(base64);
      }
    };

    reader.readAsDataURL(blob);

    console.log(file);
  }

  ngOnInit(): void {}

  chains(networks: Chain[]) {
    return networks.map((c) => c.name).join(', ');
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
