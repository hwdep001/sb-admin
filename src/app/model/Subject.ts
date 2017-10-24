export interface SubjectInterface {
  key?: string;
  name?: string;
  num?: number;
}

export class Subject implements SubjectInterface {
  key?: string;
  name?: string;
  num?: number;

  constructor(obj?: SubjectInterface) {
      this.key = obj && obj.key || null;
      this.name = obj && obj.name || null;
      this.num = obj && obj.num || 0;
  }
}