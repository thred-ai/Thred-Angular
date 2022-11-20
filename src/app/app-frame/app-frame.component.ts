import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ethers } from 'ethers';
import { LoadService } from '../load.service';
import { Util } from '../util.model';
import * as protocolSDK from 'thred-protocol-sdk';

@Component({
  selector: 'app-app-frame',
  templateUrl: './app-frame.component.html',
  styleUrls: ['./app-frame.component.scss'],
})
export class AppFrameComponent implements OnInit {
  provider?: ethers.providers.Web3Provider;
  address?: string;
  app?: Util;
  chain = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loadService: LoadService,
    public dialogRef: MatDialogRef<AppFrameComponent>,
    private cdr: ChangeDetectorRef
  ) {
    this.provider = data.provider;
    this.address = data.address;
    this.chain = data.chain;
    this.app = data.app;

    //Unique session key for the active app instance

    protocolSDK.setAppListener(data.app.id ?? '1', async (data) => {
      //Contract Details
      const contractData = data.contract;
      const address = contractData.address;
      const abi = contractData.abi;

      //Function Details
      const name = data.name;
      const params = data.params;
      const type = data.type ?? 'transact';

      //Get Connected Signer
      let signer = this.provider?.getSigner(); //retrieve signer

      let contract = new ethers.Contract(address, abi, signer);

      if (type == 'transact') {
        const value = data.value;
        const waitMode = data.waitMode;

        //Use ethers.js to call the function on the contract with the current provider.
        let transaction = await contract[name](...params, {
          value,
        });

        //Check wait mode passed by the app
        if (waitMode == 'wait' || waitMode == 'wait_update') {
          if (waitMode == 'wait_update') {
            protocolSDK.sendTransactionReceipt(transaction);
          }
          await transaction.wait();
        }

        protocolSDK.sendTransactionReceipt(transaction);
      } else if (type == 'view') {
        let data = await contract[name](...params);

        protocolSDK.sendViewData(data);
      }
    });
  }

  ngOnInit(): void {
    
  }

  @ViewChild('frame') public frame?: ElementRef;


  close() {
    this.dialogRef.close();
  }
}
