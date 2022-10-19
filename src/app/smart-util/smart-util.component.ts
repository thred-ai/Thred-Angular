import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
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
    appImg: [null, Validators.required],
    marketingImg: [null, Validators.required],
  });

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
    this.dialogRef.close()
  }

  async changed(event: MatSelectChange) {
    console.log(event.value);
    this.utilForm.controls['networks'].setValue(event.value);

    return undefined;
  }
}
