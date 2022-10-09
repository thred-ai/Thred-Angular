import { ChangeDetectorRef, Component } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  openMobileMenu = false
  expandedSearch = false

  constructor(private cdr: ChangeDetectorRef){
    AOS.init()
  }

  updateBar(event: boolean){
    console.log(event)
    this.expandedSearch = event;
    this.cdr.detectChanges()
  }
}
