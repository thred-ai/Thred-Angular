import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Developer } from './developer.model';
import { first } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Network, Alchemy, AlchemyProvider } from 'alchemy-sdk';

export interface Dict<T> {
  [key: string]: T;
}

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  providers: Dict<{ alchemy: Alchemy; ethers: AlchemyProvider }> = {};

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private router: Router,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private functions: AngularFireFunctions,
    private storage: AngularFireStorage
  ) {
    if (isPlatformBrowser(this.platformID)) {
      // Optional Config object, but defaults to demo api-key and eth-mainnet.

      let chains = Object.values(environment.rpc as any) as any[];
      let keys = Object.keys(environment.rpc as any) as any[];

      Promise.all(
        chains.map(async (chain, index) => {
          const alchemy = new Alchemy(chain);
          (this.providers as any)[`${keys[index]}`] = {
            alchemy,
            ethers: await alchemy.config.getProvider(),
          };
        })
      );
    }
  }

  finishSignUp(
    email: string,
    password: string,
    callback: (result: { status: boolean; msg: string }) => any
  ) {
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        callback({ status: true, msg: 'success' });
      })
      .catch((err: Error) => {
        callback({ status: false, msg: err.message });
      });
  }

  finishSignIn(
    email: string,
    password: string,
    callback: (result: { status: boolean; msg: string }) => any
  ) {
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        callback({ status: true, msg: 'success' });
      })
      .catch((err: Error) => {
        console.log(err);
        callback({ status: false, msg: err.message });
      });
  }

  finishPassReset(
    email: string,
    callback: (result: { status: boolean; msg: string }) => any
  ) {}

  openItem(id: string) {
    this.router.navigateByUrl(`/utils/${id}`);
  }

  openCategory(id: string) {
    this.router.navigateByUrl(`/groups/${id}`);
  }

  openDevProfile(id: string) {
    this.router.navigateByUrl(`/developers/${id}`);
  }

  openAuth(id: string) {
    this.router.navigateByUrl(`/account?mode=${id}`);
  }

  openDash(id: string) {
    this.router.navigateByUrl(`/dashboard/${id}`);
  }

  openHome() {
    this.router.navigateByUrl(`/home`);
  }

  addDays(date: Date, days: number) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + days,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
  }

  get currentUser() {
    return this.auth.authState.pipe(first()).toPromise();
  }

  signOut(callback: (result: boolean) => any) {
    try {
      this.auth.signOut();
      localStorage.removeItem('url');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      this.openAuth('0');
      callback(true);
    } catch (error) {
      callback(false);
    }
  }

  async saveUserInfo(
    data: Developer,
    imgFile: File,
    uploadImage: boolean,
    callback: (result?: Developer) => any
  ) {
    let uid = data.id;
    let url = data.url;
    let name = data.name;
    let email = data.email;

    if (uploadImage) {
      try {
        let ref = this.storage.ref(`users/${uid}/profile.png`);
        await ref.put(imgFile, { cacheControl: 'no-cache' });
        url = await ref.getDownloadURL().toPromise();
      } catch (error) {
        callback(undefined);
      }
    }

    let userInfo = {
      uid,
      url,
      name,
      email,
    };

    try {
      await this.db
        .collection('Developers')
        .doc(uid)
        .set(userInfo, { merge: true });

      localStorage['url'] = url;
      localStorage['name'] = name;
      localStorage['email'] = email;

      callback(new Developer(name, uid, [], 0, url, email));
    } catch (error) {
      callback(undefined);
    }
  }

  getUserInfo(uid: string, callback: (result?: Developer) => any) {
    var query = this.db.collection('Developers', (ref) =>
      ref.where(firebase.firestore.FieldPath.documentId(), '==', uid)
    );

    let sub = query.valueChanges().subscribe((docs) => {
      let doc = docs[0] as DocumentData;

      if (doc) {
        let name = doc['name'] as string;
        let email = doc['email'] as string;
        let joined = doc['joined'] as number;
        let uid = doc['uid'] as string;
        let url = doc['url'] as string;
        if (isPlatformBrowser(this.platformID)) {
          localStorage['url'] = url;
          localStorage['name'] = name;
          localStorage['email'] = email;
        }
        let developer = new Developer(name, uid, [], joined, url, email);
        callback(developer);
      } else {
        callback(undefined);
      }
      sub.unsubscribe();
    });
  }

  async initializeProvider() {
    if (isPlatformBrowser(this.platformID)) {
      let w = window as any;
      if (w && w.ethereum) {
        const provider = new ethers.providers.Web3Provider(w.ethereum, 'any');
        try {
          await provider.send('eth_requestAccounts', []);
        } catch (error: any) {
          if (error.code === 4001) {
            console.log('Please connect to MetaMask.');
          }
        }
        return provider;
      }
    }
    return undefined;
  }

  async checkChain(id: number, provider: ethers.providers.Web3Provider) {
    const chainId = 137; // Polygon Mainnet

    let network = await provider.getNetwork();
    if (network.chainId !== chainId) {
      try {
        await provider.send('wallet_switchEthereumChain', [
          { chainId: ethers.utils.hexValue(chainId) },
        ]);
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        let err = error as any;
        if (err.code === 4902) {
          await provider.send('wallet_addEthereumChain', [
            {
              chainName: 'Polygon Mainnet',
              chainId: ethers.utils.hexValue(chainId),
              nativeCurrency: {
                name: 'MATIC',
                decimals: 18,
                symbol: 'MATIC',
              },
              rpcUrls: ['https://polygon-rpc.com/'],
            },
          ]);
        }
      }
    }
  }
}
