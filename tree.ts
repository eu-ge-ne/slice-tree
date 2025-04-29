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

  *line(index: number): Generator<string> {
    const line_breaks = this.#str.matchAll(/r?\n/gm).toArray().map((x) => ({
      start: x.index,
      end: x.index + x[0].length,
    }));

    if (index === 0) {
      yield this.#str.slice(0, line_breaks[0]?.end);
    } else {
      yield this.#str.slice(
        line_breaks[index - 1]?.end,
        line_breaks[index]?.end,
      );
    }
  }

  write(index: number, text: string): void {
    this.#str = this.#str.slice(0, index) + text + this.#str.slice(index);
  }

  erase(_index: number, _count: number): void {
  }
}
