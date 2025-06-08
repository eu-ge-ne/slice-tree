export abstract class BufferFactory {
  abstract create(text: string): Buffer;
}

export abstract class Buffer {
  len = 0;
  eol_starts: number[] = [];
  eol_ends: number[] = [];

  abstract append(text: string): void;
  abstract read(index: number, n: number): IteratorObject<string>;

  find_eol(a: number, index: number): number {
    let b = this.eol_starts.length - 1;
    let i = 0;
    let v = 0;

    while (a <= b) {
      i = Math.trunc((a + b) / 2);
      v = this.eol_starts[i]!;

      if (v < index) {
        a = i + 1;
      } else if (v > index) {
        b = i - 1;
      } else {
        a = i;
        break;
      }
    }

    return a;
  }
}
