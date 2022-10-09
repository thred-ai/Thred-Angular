import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  searchForm = this.fb.group({
    text: "",
  });

  loading = false

  search(){
    this.loading = true

    setTimeout(() => {
      this.loading = false
    }, 3000);
  }

  changed(event: any){
    this.inputChanged.emit(event.target.value != "")
    this.cdr.detectChanges()
  }

  @Input() placeholder?: string = "Search"
  @Output() inputChanged = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  

}
