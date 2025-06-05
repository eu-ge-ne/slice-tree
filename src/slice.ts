import { type Buffer, find_eol, grow_buffer, new_buffer } from "./buffer.ts";
import type { Reader } from "./reader.ts";

export interface Slice {
  readonly buf: Buffer;
  start: number;
  len: number;
  eols_start: number;
  eols_len: number;
}

export function new_slice(
  buf: Buffer,
  start: number,
  len: number,
  eols_start: number,
  eols_len: number,
): Slice {
  return {
    buf,
    start,
    len,
    eols_start,
    eols_len,
  };
}

export function slice_from_text(reader: Reader, text: string): Slice {
  const buf = new_buffer(reader, text);

  return new_slice(buf, 0, buf.len, 0, buf.eol_starts.length);
}

export function slice_growable(slice: Slice): boolean {
  return (slice.buf.len < 100) && (slice.start + slice.len === slice.buf.len);
}

export function grow_slice(slice: Slice, text: string): void {
  grow_buffer(slice.buf, text);

  resize_slice(slice, slice.len + [...text].length);
}

export function trim_slice_end(slice: Slice, n: number): void {
  resize_slice(slice, slice.len - n);
}

export function trim_slice_start(slice: Slice, n: number): void {
  slice.start += n;
  slice.len -= n;

  slice.eols_start = find_eol(slice.buf, slice.eols_start, slice.start);

  const eols_end = find_eol(
    slice.buf,
    slice.eols_start,
    slice.start + slice.len,
  );

  slice.eols_len = eols_end - slice.eols_start;
}

export function resize_slice(slice: Slice, len: number): void {
  slice.len = len;

  const eols_end = find_eol(
    slice.buf,
    slice.eols_start,
    slice.start + slice.len,
  );

  slice.eols_len = eols_end - slice.eols_start;
}

export function split_slice(slice: Slice, index: number, gap: number): Slice {
  const start = slice.start + index + gap;
  const len = slice.len - index - gap;

  resize_slice(slice, index);

  const eols_start = find_eol(
    slice.buf,
    slice.eols_start + slice.eols_len,
    start,
  );

  const eols_end = find_eol(slice.buf, eols_start, start + len);
  const eols_len = eols_end - eols_start;

  return new_slice(slice.buf, start, len, eols_start, eols_len);
}
