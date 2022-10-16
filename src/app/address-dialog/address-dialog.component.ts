import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Util } from '../util.model';
import { Chain } from '../chain.model';
import { MatSelectChange } from '@angular/material/select';
import { HostListener } from '@angular/core';
import { NameEnsLookupPipe } from '../name-ens-lookup.pipe';
import { LoadService } from '../load.service';
import { AddressValidatePipe } from '../address-validate.pipe';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss'],
})
export class AddressDialogComponent implements OnInit {
  constructor(
    private loadService: LoadService,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {
    this.filteredAddresses = this.addressCtrl.valueChanges.pipe(
      startWith(null),
      map((address: string | null) =>
        address ? this._filter(address) : this.addresses.slice()
      )
    );
  }

  selectedAddresses: string[] = [];
  selectable = true;
  removable = true;
  addressCtrl = new FormControl();
  filteredAddresses: Observable<any[]>;
  addresses: any[] = [];
  selectedChain?: Chain = this.item?.chains[0];
  finalAddresses: string[] = [];

  @HostListener('click') onClick() {
    if (isPlatformBrowser(this.platformID)) {
      this.selectedAddresses.forEach((_, index: number) => {
        if (document.getElementsByClassName(`menu-${index}`).length > 0) {
          (
            Object.values(
              document.getElementsByClassName(`close-${index}`)
            )[0] as HTMLElement
          ).click();
        }
      });
    }
  }

  @HostListener('touchstart') onTouch() {
    if (isPlatformBrowser(this.platformID)) {
      this.selectedAddresses.forEach((_, index: number) => {
        if (document.getElementsByClassName(`menu-${index}`).length > 0) {
          (
            Object.values(
              document.getElementsByClassName(`close-${index}`)
            )[0] as HTMLElement
          ).click();
        }
      });
    }
  }

  async changed(event: MatSelectChange) {
    this.selectedChain = event.value;
    this.finalAddresses = [];

    if (isPlatformBrowser(this.platformID)) {
      return Promise.all(
        this.selectedAddresses.map(async (address) => {
          let result = (await this.checkValidAddress(address)) ? true : false;
          if (result) {
            this.finalAddresses.push(address);
          }
        })
      );
    }
    return undefined;
  }

  async add(event: MatChipInputEvent) {
    const value = event.value || '';

    this.selectedAddresses.push(value);

    // Clear the input value
    event.chipInput!.clear();
    this.addressCtrl.setValue(null);

    if (await this.checkValidAddress(value)) {
      this.finalAddresses.push(value);
    }
  }

  async checkValidAddress(address: string) {
    let ensPipe = new NameEnsLookupPipe(this.loadService, this.platformID);
    let addressPipe = new AddressValidatePipe(this.platformID);

    let validAddress = addressPipe.transform(address);
    let validName = await ensPipe.transform(address);

    let isValid =
      this.selectedChain?.id == 1
        ? validAddress
          ? validAddress
          : validName
        : validAddress;

    return isValid;
  }

  @ViewChild('addressInput') addressInput?: ElementRef<HTMLInputElement>;

  get item(): Util {
    return this.util;
  }

  @Input() set item(newItem: Util) {
    this.util = newItem;
    this.selectedChain = newItem.chains[0];
  }

  private util!: Util;

  separatorKeysCodes: number[] = [ENTER, COMMA];

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

  remove(address: string, isValid: boolean): void {
    const index = this.selectedAddresses.indexOf(address);

    if (index >= 0) {
      this.selectedAddresses.splice(index, 1);
    }

    if (isValid) {
      const index = this.finalAddresses.indexOf(address);

      if (index >= 0) {
        this.finalAddresses.splice(index, 1);
      }
    }
  }

  saving = false;

  ngOnInit(): void {
    console.log(this.item);
  }
}
