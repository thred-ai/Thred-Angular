import { isPlatformBrowser, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadService } from './load.service';
import { Util } from './util.model';

// import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  openMobileMenu = false;
  expandedSearch = false;
  selectedInstall?: Util

  constructor(
    private cdr: ChangeDetectorRef,
    private loadService: LoadService,
    private _router: Router,
    public router: ActivatedRoute,
    public location: Location,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {
    if (!isPlatformBrowser(this.platformID)) {
      this.display = false;
    }
  }

  featuredUtil?: Util;
  display = true;


  sendToChildEmitter = new EventEmitter();

  onChildEvent(data: any) {
    // your logic here
    if (data && data.install) {
      console.log(data);
      this.selectedInstall = data.install
      this.sidenav?.toggle();
    }
  }
  

  @ViewChild('drawer') public sidenav?: MatSidenav;

  onActivate(event: any) {
    if (isPlatformBrowser(this.platformID)){
      window.scroll(0, 0);
    }
    if (this.selectedInstall || this.openMobileMenu){
      this.sidenav?.toggle();
    }
    this.selectedInstall = undefined
    this.cdr.detectChanges()

    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth',
    // });

    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
  
  routeToAuth(mode = '0'){
    this.loadService.openAuth(mode)
  }

  routeToHome(){
    this.loadService.openHome()
  }

  ngOnInit() {
    // console.log("mayn")
    // this.readData()
   
  }

  // async readData(){
  //   const sdk = new ThirdwebSDK('polygon');

  //   // access your deployed contracts
  //   const contract = await sdk.getContract('0x96988A60c4E36207cfc76beDae5171deDbB55e8d');

  //   console.log(contract)

  //   // Read data using direct calls to your contract
  //   // const myData = await contract.call('deployerAddress');
  //   // console.log(myData)
  // }

  updateBar(event: boolean) {
    console.log(event);
    this.expandedSearch = event;
    this.cdr.detectChanges();
  }
}
