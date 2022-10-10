import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  openMobileMenu = false;
  expandedSearch = false;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {
    if (isPlatformBrowser(this.platformID)) {
      // AOS.init();
    }

  }

  onActivate(event: any) {
    // window.scroll(0,0);
 
    window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
     });
 
     //or document.body.scrollTop = 0;
     //or document.querySelector('body').scrollTo(0,0)
 }

  ngOnInit(){
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
