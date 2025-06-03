import { Buffer } from "./buffer.ts";

export class Slice {
  #buf: Buffer;

  start: number;
  len: number;
  eols_start: number;
  eols_len: number;

  constructor(
    buffer: Buffer,
    start: number,
    len: number,
    eols_start: number,
    eols_len: number,
  ) {
    this.#buf = buffer;

    this.start = start;
    this.len = len;
    this.eols_start = eols_start;
    this.eols_len = eols_len;
  }

  static from_text(text: string): Slice {
    const buffer = new Buffer(text);

    return new Slice(buffer, 0, buffer.len, 0, buffer.eol_starts.length);
  }

  get growable(): boolean {
    return (this.#buf.len < 100) && (this.start + this.len === this.#buf.len);
  }

  append(text: string): void {
    this.#buf.append(text);

    this.resize(this.len + [...text].length);
  }

  trim_end(n: number): void {
    this.resize(this.len - n);
  }

  trim_start(n: number): void {
    this.start += n;
    this.len -= n;

    this.eols_start = this.#buf.find_eol(this.eols_start, this.start);

    const eols_end = this.#buf.find_eol(this.eols_start, this.start + this.len);

    this.eols_len = eols_end - this.eols_start;
  }

  resize(len: number): void {
    this.len = len;

    const eols_end = this.#buf.find_eol(this.eols_start, this.start + this.len);

    this.eols_len = eols_end - this.eols_start;
  }

  split(index: number, gap: number): Slice {
    const start = this.start + index + gap;
    const len = this.len - index - gap;

    this.resize(index);

    const eols_start = this.#buf.find_eol(
      this.eols_start + this.eols_len,
      start,
    );

    const eols_end = this.#buf.find_eol(eols_start, start + len);
    const eols_len = eols_end - eols_start;

    return new Slice(this.#buf, start, len, eols_start, eols_len);
  }

  read(start: number, count: number): IteratorObject<string> {
    return this.#buf.read(this.start + start, count);
  }

  get_eol_end(i: number): number {
    return this.#buf.eol_ends[i]!;
  }
}
