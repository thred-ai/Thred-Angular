// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebase: {
    apiKey: 'AIzaSyD3Ec_FWZrlbTBWdgBWRrsBwMmXQ4aniWU',
    // authDomain: "shopmythred.com",
    databaseURL: 'https://clothingapp-ed125.firebaseio.com',
    projectId: 'clothingapp-ed125',
    storageBucket: 'clothingapp-ed125.appspot.com',
    messagingSenderId: '628658827719',
    appId: '1:628658827719:web:66671544aeb6d2a78029e2',
    measurementId: 'G-YVHCR44N65',
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
