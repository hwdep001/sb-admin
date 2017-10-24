export interface WordInterface {
    key?: string;
    head1?: string;
    head2?: string;
    body1?: string;
    body2?: string;
    num?: number;
  
    subKey?: string;
    catKey?: string;
    catName?: string;
    lecKey?: string;
    lecName?: string;
  
    //
    level?: number;
    code?: number;
  }
  
  export class Word implements WordInterface {
    key?: string;
    head1?: string;
    head2?: string;
    body1?: string;
    body2?: string;
    num?: number;
    
    subKey?: string;
    catKey?: string;
    catName?: string;
    lecKey?: string;
    lecName?: string;
  
    //
    level?: number;
    code?: number;
  
    constructor(obj?: WordInterface){
      this.key = obj && obj.key || null;
      this.head1 = obj && obj.head1 || null;
      this.head2 = obj && obj.head2 || null;
      this.body1 = obj && obj.body1 || null;
      this.body2 = obj && obj.body2 || null;
      this.num = obj && obj.num || 0;
  
      this.subKey = obj && obj.subKey || null;
      this.catKey = obj && obj.catKey || null;
      this.catName = obj && obj.catName || null;
      this.lecKey = obj && obj.lecKey || null;
      this.lecName = obj && obj.lecName || null;
  
      this.level = obj && obj.level || 0;
      this.code = obj && obj.code || 0;
    }
  }