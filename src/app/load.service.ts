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

export interface Dict<T> {
  [key: string]: T;
}

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  providers: {
    any?: ethers.providers.JsonRpcProvider;
  } = {};

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private router: Router,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private functions: AngularFireFunctions,
    private storage: AngularFireStorage
  ) {
    if (isPlatformBrowser(this.platformID)) {
      let chains = [1, 13, 5, 80001];
      chains.forEach((chain) => {
        let str = `${chain}` as string;
        let rpcEndpoint1 = (environment.rpc as any)[str];
        let provider1 = new ethers.providers.JsonRpcProvider(rpcEndpoint1);
        (this.providers as any)[str] = provider1;
      });
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
        console.log(err);
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
}
