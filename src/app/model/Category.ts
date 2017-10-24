export interface CategoryInterface {
  key?: string;
  name?: string;
  num?: number;
}

export class Category implements CategoryInterface {
  key?: string;
  name?: string;
  num?: number;
  true: boolean = true;

  constructor(obj?: CategoryInterface) {
    this.key = obj && obj.key || null;
    this.name = obj && obj.name || null;
    this.num = obj && obj.num || 0;
    this.true = true;
  }
}