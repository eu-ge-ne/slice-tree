import { Buffer } from "./buffer.ts";

export class Slice {
  buffer: Buffer;
  chars_start: number;
  chars_length: number;
  eols_start: number;
  eols_length: number;

  constructor(
    buffer: Buffer,
    chars_start: number,
    chars_length: number,
    eols_start: number,
    eols_length: number,
  ) {
    this.buffer = buffer;
    this.chars_start = chars_start;
    this.chars_length = chars_length;
    this.eols_start = eols_start;
    this.eols_length = eols_length;
  }

  static from_text(text: string): Slice {
    const buffer = new Buffer(text);

    return new Slice(buffer, 0, buffer.char_count, 0, buffer.eol_starts.length);
  }

  get growable(): boolean {
    return (this.buffer.char_count < 100) &&
      (this.chars_start + this.chars_length === this.buffer.char_count);
  }

  append(text: string): void {
    this.buffer.append(text);

    this.resize(this.chars_length + [...text].length);
  }

  trim_end(n: number): void {
    this.resize(this.chars_length - n);
  }

  trim_start(n: number): void {
    this.chars_start += n;
    this.chars_length -= n;

    this.eols_start = this.buffer.find_eol(this.eols_start, this.chars_start);

    const eols_end = this.buffer.find_eol(
      this.eols_start,
      this.chars_start + this.chars_length,
    );

    this.eols_length = eols_end - this.eols_start;
  }

  resize(chars_length: number): void {
    this.chars_length = chars_length;

    const eols_end = this.buffer.find_eol(
      this.eols_start,
      this.chars_start + this.chars_length,
    );

    this.eols_length = eols_end - this.eols_start;
  }

  split(index: number, delete_count: number): Slice {
    const chars_start = this.chars_start + index + delete_count;
    const chars_length = this.chars_length - index - delete_count;

    this.resize(index);

    const eols_start = this.buffer.find_eol(
      this.eols_start + this.eols_length,
      chars_start,
    );

    const eols_end = this.buffer.find_eol(
      eols_start,
      chars_start + chars_length,
    );

    const eols_length = eols_end - eols_start;

    const slice = new Slice(
      this.buffer,
      chars_start,
      chars_length,
      eols_start,
      eols_length,
    );

    return slice;
  }

  read(start: number, count: number): IteratorObject<string> {
    return this.buffer.read(this.chars_start + start, count);
  }
}
