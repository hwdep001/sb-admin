export interface LectureInterface {
  key?: string;
  name?: string;
  num?: number;
}

export class Lecture implements LectureInterface {
  key?: string;
  name?: string;
  num?: number;
  true: boolean = true;

  constructor(obj?: LectureInterface){
    this.key = obj && obj.key || null;
    this.name = obj && obj.name || null;
    this.num = obj && obj.num || 0;
    this.true = true;
  }
}