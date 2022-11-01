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
import { HttpClient } from '@angular/common/http';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Meta, Title } from '@angular/platform-browser';

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

  defaultCoords = {
    address: {
      city: 'Los Angeles',
      country: 'United States',
      country_code: 'US',
      region: 'California',
      region_code: 'CA',
    },
    coords: {
      LONGITUDE: -118.243683,
      LATITUDE: 34.052235,
    },
  };

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private router: Router,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private functions: AngularFireFunctions,
    private storage: AngularFireStorage,
    private http: HttpClient,
    private metaService: Meta,
    private titleService: Title
  ) {
    if (isPlatformBrowser(this.platformID)) {
      let chains = Object.values(environment.rpc);
      let keys = Object.keys(environment.rpc);

      Promise.all(
        chains.map(async (chain, index) => {
          const alchemy = new Alchemy({
            network: chain.network,
            apiKey: chain.apiKey,
            url: `${chain.prefix}${chain.apiKey}`,
          });
          this.providers[`${keys[index]}`] = {
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

    if (uploadData.downloads > 0) {
      delete uploadData.downloads;
    }

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

  getItems(ids: string[], callback: (result?: Util[]) => any) {
    console.log(ids);
    let sub2 = this.db
      .collectionGroup(`Items`, (ref) => ref.where('id', 'in', ids))
      .valueChanges()
      .subscribe((docs2) => {
        sub2.unsubscribe();

        let docs_2 = docs2 as any[];

        let docs = docs_2 ?? [];

        let result: Util[] = [];

        docs.forEach((d) => {
          let util = d as Util;

          d.chains.forEach((c: any, i: number) => {
            d.chains[i] = this.chains.find((x) => x.id == c);
          });

          result.push(util);
        });
        callback(result);
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

  async logView(productId: string, uid: string) {
    if (uid && isPlatformBrowser(this.platformID)) {
      let coords = (await this.getCoords()) ?? this.defaultCoords;
      this.updateView(uid, coords, productId);
    }
  }

  updateView(uid: string, location: any, docId: string) {
    const time = new Date();

    const docName =
      String(time.getFullYear()) +
      String(time.getMonth()) +
      String(time.getDate()) +
      String(time.getHours());

    return this.db
      .collection('Developers/' + uid + '/Daily_Info')
      .doc(`V${docName}`)
      .set(
        {
          time: firebase.firestore.FieldValue.arrayUnion({
            time,
            docId,
            coords: location.coords,
            address: location.address,
          }),
          timestamp: time,
          type: 'VIEW',
        },
        { merge: true }
      );
  }

  getMiscStats(
    uid: string,
    date1: Date,
    date2: Date,
    callback: (views?: Dict<any>[]) => any
  ) {
    var views: Dict<any>[] = [];

    let sub = this.db
      .collection('Developers/' + uid + '/Daily_Info/', (ref) =>
        ref
          .where('timestamp', '>=', date1)
          .where('timestamp', '<=', new Date(date2.setHours(23, 59, 59, 999)))
      )
      .valueChanges()
      .subscribe((docDatas) => {
        docDatas.forEach((doc, index) => {
          const docData = doc as DocumentData;
          if (docData) {
            let time = docData['time'] as Array<any>;
            let type = docData['type'] as string;
            time.forEach((t) => {
              let p =
                t instanceof firebase.firestore.Timestamp
                  ? (t as firebase.firestore.Timestamp).toDate()
                  : (t.time as firebase.firestore.Timestamp).toDate();
              let v =
                t instanceof firebase.firestore.Timestamp
                  ? this.defaultCoords.coords
                  : t.coords;
              let address =
                t instanceof firebase.firestore.Timestamp
                  ? this.defaultCoords.address
                  : t.address;
              let docId =
                t instanceof firebase.firestore.Timestamp ? undefined : t.docId;
              views?.push({
                num: 1,
                coords: v,
                address,
                docId,
                type,
                timestamp: p,
              });
            });
          }
        });
        callback(views);
        if (isPlatformBrowser(this.platformID)) sub.unsubscribe();
      });
  }

  async getCoords() {
    let value = (await this.http
      .get('https://api.ipify.org/?format=json')
      .toPromise()) as Dict<any>;

    let url = `https://api.ipstack.com/${value['ip']}?access_key=5b5f96aced42e6b1c95ab24d96f704c5`;
    let resp = (await this.http.get(url).toPromise()) as Dict<any>;
    let address = {
      city: resp['city'],
      country: resp['country_name'],
      country_code: resp['country_code'],
      region: resp['region_name'],
      region_code: resp['region_code'],
    };
    let coords = {
      LATITUDE: resp['latitude'],
      LONGITUDE: resp['longitude'],
    };
    return {
      coords,
      address,
    };
  }

  async initializeProvider(mode = 0) {
    if (isPlatformBrowser(this.platformID)) {
      let w = window as any;
      if (mode == 0 && w && w.ethereum) {
        const provider = new ethers.providers.Web3Provider(w.ethereum, 'any');
        try {
          await provider.send('eth_requestAccounts', []);
        } catch (error: any) {
          if (error.code === 4001) {
            return undefined;
          }
        }
        return provider;
      } else if (mode == 1) {
        const options = {
          rpc: {},
          chainId: 1,
        };

        let keys = Object.keys(this.providers);
        keys.forEach((chainId) => {
          let provider = this.providers[chainId];
          let alchemy = provider.alchemy;
          let url = alchemy.config.url;
          (options.rpc as any)[chainId] = url;
        });

        try {
          const provider = new WalletConnectProvider(options);

          await provider.enable();
          const ethersProvider = new ethers.providers.Web3Provider(provider);

          return ethersProvider;
        } catch (error) {
          return undefined;
        }
      }
    }
    return undefined;
  }

  async checkChain(chainId: number, provider: ethers.providers.Web3Provider) {
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

  addTags(title: string, imgUrl: string, description: string, url: string) {
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:image', content: imgUrl });
    this.metaService.updateTag({
      property: 'og:image:secure_url',
      content: imgUrl,
    });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    // this.metaService.removeTag("name='robots'");
    // this.metaService.removeTag("name='googlebot'");
  }
}
