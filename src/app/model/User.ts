export interface UserInterface {
  uid?: string;
  email?: string;
  name?: string;
  photoURL?: string;

  createDate?: any;
  lastSigninDate?: any;
  ad?: boolean;

  authenticated?: boolean;
}

export class User implements UserInterface {
  uid?: string;
  email?: string;
  name?: string;
  photoURL?: string;

  createDate?: any;
  lastSigninDate?: any;
  ad?: boolean;

  authenticated?: boolean;


  //
  displayName?: string;

  constructor(obj?: UserInterface){
      this.uid = obj && obj.uid || null;
      this.email = obj && obj.email || null;
      this.name = obj && obj.name || null;
      this.photoURL = obj && obj.photoURL || null;
      this.createDate = obj && obj.createDate || null;
      this.lastSigninDate = obj && obj.lastSigninDate || null;
      this.authenticated = obj && obj.authenticated || false;
  }
}