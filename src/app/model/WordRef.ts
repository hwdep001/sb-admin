
interface levels {
  [uid: string]: number;
}

export interface WordRefInterface {
  ref?: string;
  levels?: levels;
}

export class WordRef implements WordRefInterface {
  ref?: string;
  levels?: levels;

  constructor(ref: string, levels: levels) {
      this.ref = ref,
      this.levels = levels
  }
}