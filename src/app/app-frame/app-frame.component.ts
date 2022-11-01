import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
  address?: string
  app?: Util;
  sessionKey = '12345';
  chain = 1

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loadService: LoadService,
    public dialogRef: MatDialogRef<AppFrameComponent>,
    private cdr: ChangeDetectorRef
  ) {
    this.provider = data.provider;
    this.address = data.address
    this.chain = data.chain
    this.app = data.app;

    //Unique session key for the active app instance

    protocolSDK.setAppListener(this.sessionKey, async (data) => {
      //Contract Details
      const contractData = data.contract;
      const address = contractData.address;
      const abi = contractData.abi;

      //Function Details
      const name = data.name;
      const params = data.params;
      const value = data.value;
      const waitMode = data.waitMode;

      //Get Connected Signer
      let signer = this.provider?.getSigner(); //retrieve signer

      //Use ethers.js to call the function on the contract with the current provider.
      let contract = new ethers.Contract(address, abi, signer);
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
    });
  }



  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
