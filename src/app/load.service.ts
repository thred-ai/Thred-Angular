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
import { Alchemy, AlchemyProvider } from 'alchemy-sdk';
import { Util } from './util.model';
import { Chain } from './chain.model';
import { Category } from './category.model';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Dict<T> {
  [key: string]: T;
}

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  providers: Dict<{ alchemy: Alchemy; ethers: AlchemyProvider }> = {};

  chains = [
    new Chain('Ethereum Goerli', 5, 'ETH'),
    new Chain('Polygon Mumbai', 80001, 'MATIC'),
    new Chain('Ethereum', 1, 'ETH'),
    new Chain('Polygon', 137, 'MATIC'),
  ];

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
      .then(async (user) => {
        if (user.user) {
          await this.setUserInfoInitial(user.user);
        }
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
    this.router.navigateByUrl(`/apps/${id}`);
  }

  openCategory(id: string) {
    this.router.navigateByUrl(`/groups/${id}`);
  }

  openDevProfile(id: string) {
    this.router.navigateByUrl(`/developers/${id}`);
  } //

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

  async signOut(callback: (result: boolean) => any) {
    try {
      await this.auth.signOut();
      localStorage.removeItem('url');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      this.openAuth('0');
      callback(true);
    } catch (error) {
      callback(false);
    }
  }

  getCoreABI(callback: (result?: { address: string; abi: any[] }) => any) {
    var query = this.db.collection('Protocol');

    let sub = query.valueChanges().subscribe((docs) => {
      sub.unsubscribe();
      let doc = docs[0] as DocumentData;

      if (doc) {
        let address = doc['Address'] as string;
        let abi = doc['ABI'] as any[];
        callback({ address, abi });
      } else {
        callback();
      }
    });
  }

  sendTestWebhook(webhook: string, type = 0, chain = 1, network = 'ethereum') {
    this.functions
      .httpsCallable('sendTestHook')({
        webhook,
        type,
        chain,
        network,
      })
      .pipe(first())
      .subscribe(
        async (resp) => {},
        (err) => {
          console.error({ err });
        }
      );
  }

  async saveSmartUtil(
    data: Util,
    callback: (result?: Util) => any,
    appImgFile?: File,
    marketingImgFile?: File
  ) {
    let uid = data.creator;
    let id = data.id;

    if (appImgFile) {
      try {
        let ref = this.storage.ref(`smart-utils/${id}/app-${id}.png`);
        await ref.put(appImgFile, { cacheControl: 'no-cache' });
        data.displayUrls[0] = await ref.getDownloadURL().toPromise();
      } catch (error) {
        callback(undefined);
      }
    }

    if (marketingImgFile) {
      try {
        let ref = this.storage.ref(`smart-utils/${id}/marketing-${id}.png`);
        await ref.put(marketingImgFile, { cacheControl: 'no-cache' });
        data.coverUrl = await ref.getDownloadURL().toPromise();
      } catch (error) {
        callback(undefined);
      }
    }

    let uploadData = JSON.parse(JSON.stringify(data));
    uploadData.search_name = uploadData.name?.toLowerCase();
    uploadData.chains = uploadData.chains.map((c: Chain) => c.id);

    try {
      await this.db
        .collection(`Developers/${uid}/Items`)
        .doc(id)
        .set(uploadData, { merge: true });
      callback(data);
    } catch (error) {
      callback(undefined);
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
    let search_name = name?.toLowerCase();

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
      search_name,
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

  async setUserInfoInitial(user: firebase.User) {
    let uid = user.uid;
    let email = user.email;

    let name = email?.split('@')[0].toUpperCase();
    let search_name = name?.toLowerCase();

    let joined = Math.floor(new Date().getTime());

    let url =
      'https://storage.googleapis.com/thred-protocol.appspot.com/resources/default_profile.png';

    let userRef = this.db.collection('Developers').doc(uid);

    let data = {
      name,
      uid,
      email,
      joined,
      url,
      search_name,
    };

    return userRef.set(data);
  }

  filteredSearch: BehaviorSubject<any> = new BehaviorSubject([]);

  search(term: string) {
    console.log(term);
    let sub2 = this.db
      .collectionGroup(`Items`, (ref) =>
        ref
          .where('search_name', '>=', term)
          .where('search_name', '<=', term + '\uf8ff')
          .limit(3)
      )
      .valueChanges()
      .subscribe((docs2) => {
        sub2.unsubscribe();
        let returnVal: any[] = [];

        (docs2 as Util[])?.forEach((d: Util) => {
          returnVal.push({
            name: d.name,
            type: 1,
            img: d.displayUrls[0],
            id: d.id,
          });
        });

        let sub3 = this.db
          .collectionGroup(`Developers`, (ref) =>
            ref
              .where('search_name', '>=', term)
              .where('search_name', '<=', term + '\uf8ff')
              .limit(3)
          )
          .valueChanges()
          .subscribe((docs3) => {
            sub3.unsubscribe();
            (docs3 as any[])?.forEach((d: any) => {
              returnVal.push({
                name: d.name,
                type: 0,
                img: d.url,
                id: d.uid,
              });
            });
            this.filteredSearch.next(returnVal);
          });
      });
  }

  getItem(id: string, callback: (result?: Util) => any, getProfiles = false) {
    console.log(id);
    let sub2 = this.db
      .collectionGroup(`Items`, (ref) => ref.where('id', '==', id))
      .valueChanges()
      .subscribe((docs2) => {
        sub2.unsubscribe();

        let docs_2 = docs2 as any[];

        let d = docs_2[0];

        if (d) {
          let util = d as Util;

          d.chains.forEach((c: any, i: number) => {
            d.chains[i] = this.chains.find((x) => x.id == c);
          });
          if (getProfiles) {
            this.getUserInfo(d.creator, false, (result) => {
              if (result) {
                util.creatorName = result.name;
              }
              callback(util);
            });
          } else {
            callback(util);
          }
        } else {
          callback(undefined);
        }
      });
  }

  getNewItems(callback: (result: Util[]) => any) {
    this.db
      .collectionGroup('Items', (ref) =>
        ref.orderBy('created', 'desc').limit(6)
      )
      .valueChanges()
      .subscribe((docs) => {
        let docs_2 = (docs as any[]) ?? [];
        var counter = 0;
        docs_2.forEach((d, index) => {
          d.chains.forEach((c: any, i: number) => {
            d.chains[i] = this.chains.find((x) => x.id == c);
          });
        });
        callback(docs_2);
      });
  }

  get newUtilID() {
    return this.db.createId();
  }

  getFeaturedItem(callback: (result?: Util) => any) {
    let sub2 = this.db
      .collectionGroup(`Engage`)
      .valueChanges()
      .subscribe((docs2) => {
        sub2.unsubscribe();

        let docs_2 = docs2 as any[];

        let d = docs_2[0];

        if (d) {
          let featured = d['Featured'] as string;
          this.getItem(
            featured,
            (result) => {
              callback(result);
            },
            true
          );
        } else {
          callback(undefined);
        }
      });
  }

  getUserInfo(
    uid: string,
    fetchItems = true,
    callback: (result?: Developer) => any
  ) {
    var query = this.db.collection('Developers', (ref) =>
      ref.where(firebase.firestore.FieldPath.documentId(), '==', uid)
    );

    let sub = query.valueChanges().subscribe(async (docs) => {
      let doc = docs[0] as DocumentData;

      if (doc) {
        let name = doc['name'] as string;
        let email = doc['email'] as string;
        let joined = doc['joined'] as number;
        let uid = doc['uid'] as string;
        let url = doc['url'] as string;
        let myUID = (await this.currentUser)?.uid;
        if (isPlatformBrowser(this.platformID) && uid == myUID) {
          localStorage['url'] = url;
          localStorage['name'] = name;
          localStorage['email'] = email;
        }
        let developer = new Developer(name, uid, [], joined, url, email);

        if (fetchItems) {
          let sub2 = this.db
            .collection(`Developers/${uid}/Items`)
            .valueChanges()
            .subscribe((docs2) => {
              let docs_2 = docs2 as any[];

              docs_2.forEach((d) => {
                d.chains.forEach((c: any, i: number) => {
                  d.chains[i] = this.chains.find((x) => x.id == c);
                });
              });
              developer.utils = (docs_2 as Util[]) ?? [];

              callback(developer);
              sub2.unsubscribe();
            });
        } else {
          callback(developer);
        }
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
