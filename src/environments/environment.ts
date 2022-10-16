// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebase: {
    apiKey: 'AIzaSyCCV1HUWCeM0kaSVM7FcpDyHrTanse6BAk',
    authDomain: 'thred-protocol.firebaseapp.com',
    projectId: 'thred-protocol',
    storageBucket: 'thred-protocol.appspot.com',
    messagingSenderId: '313615470277',
    appId: '1:313615470277:web:76f4e51ce27c1338aa2aac',
    measurementId: 'G-4NPVBWK3NK',
  },

  rpc: {
    '1': 'https://eth-mainnet.g.alchemy.com/v2/6ITDh9cH13O7QaI61cL0QRvBQS-Js1km',
    '137':
      'https://polygon-mainnet.g.alchemy.com/v2/zZ_J8XGhVME0rH8TX0aiqEX8C37rlPIG',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
