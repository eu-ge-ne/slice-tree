export class SliceTree {
  #str = "";

  get count(): number {
    return this.#str.length;
  }

  get line_count(): number {
    return 1 + this.#str.matchAll(/r?\n/gm).toArray().length;
  }

  *read(_start: number, _end = Number.MAX_SAFE_INTEGER): Generator<string> {
    yield this.#str;
  }

  *line(_index: number): Generator<string> {
    yield this.#str;
  }

  write(index: number, text: string): void {
    this.#str = this.#str.slice(0, index) + text + this.#str.slice(index);
  }

  erase(_index: number, _count: number): void {
  }
}
