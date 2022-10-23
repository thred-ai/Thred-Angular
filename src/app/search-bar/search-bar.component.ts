import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ethers } from 'ethers';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Chain } from '../chain.model';
import { Developer } from '../developer.model';
import { LoadService } from '../load.service';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  control = new FormControl('');
  filteredData: any[] = [];

  loadedData: Array<any> = [
    
  ];

  loading = false;

  size(f: any[]){
    return f.length > 4 ? '295' : `${50*f.length}`
  }

  selected(val: any){
    console.log(val)
    let type = val.type
    let id = val.id

    if (type == 0){
      this.loadService.openDevProfile(id)
    }
    else if (type == 1){
      this.loadService.openItem(id)
    }
  }

  search() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  changed(event: any) {
    this.inputChanged.emit(event.target.value != '');

    let text = this.control.value

    this.loadData(text)

    this.cdr.detectChanges();
  }

  
  loadData(text: string) {
    this.loadService.search(text)
  }

  @Input() placeholder?: string = 'Search';
  @Output() inputChanged = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private loadService: LoadService) {
    this.loadService.filteredSearch.subscribe(s => {
      console.log(s)
      this.filteredData = s
    })
  }


  ngOnInit() {}

}
