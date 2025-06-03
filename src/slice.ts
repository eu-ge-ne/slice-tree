import { Buffer } from "./buffer.ts";

export class Slice {
  #buf: Buffer;

  start: number;
  length: number;
  eols_start: number;
  eols_length: number;

  constructor(
    buffer: Buffer,
    start: number,
    length: number,
    eols_start: number,
    eols_length: number,
  ) {
    this.#buf = buffer;

    this.start = start;
    this.length = length;
    this.eols_start = eols_start;
    this.eols_length = eols_length;
  }

  static from_text(text: string): Slice {
    const buffer = new Buffer(text);

    return new Slice(buffer, 0, buffer.length, 0, buffer.eol_starts.length);
  }

  get growable(): boolean {
    return (this.#buf.length < 100) &&
      (this.start + this.length === this.#buf.length);
  }

  append(text: string): void {
    this.#buf.append(text);

    this.resize(this.length + [...text].length);
  }

  trim_end(n: number): void {
    this.resize(this.length - n);
  }

  trim_start(n: number): void {
    this.start += n;
    this.length -= n;

    this.eols_start = this.#buf.find_eol(this.eols_start, this.start);

    const eols_end = this.#buf.find_eol(
      this.eols_start,
      this.start + this.length,
    );

    this.eols_length = eols_end - this.eols_start;
  }

  resize(length: number): void {
    this.length = length;

    const eols_end = this.#buf.find_eol(
      this.eols_start,
      this.start + this.length,
    );

    this.eols_length = eols_end - this.eols_start;
  }

  split(index: number, gap: number): Slice {
    const start = this.start + index + gap;
    const length = this.length - index - gap;

    this.resize(index);

    const eols_start = this.#buf.find_eol(
      this.eols_start + this.eols_length,
      start,
    );

    const eols_end = this.#buf.find_eol(eols_start, start + length);
    const eols_length = eols_end - eols_start;

    return new Slice(this.#buf, start, length, eols_start, eols_length);
  }

  read(start: number, count: number): IteratorObject<string> {
    return this.#buf.read(this.start + start, count);
  }

  get_eol_end(i: number): number {
    return this.#buf.eol_ends[i]!;
  }
}
