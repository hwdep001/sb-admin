// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAtwwAwQfcVgnvcPzQbFywaBNyzGjizJUE",
    authDomain: "study-v2.firebaseapp.com",
    databaseURL: "https://study-v2.firebaseio.com",
    projectId: "study-v2",
    storageBucket: "study-v2.appspot.com",
    messagingSenderId: "657779510797"
  }
};
