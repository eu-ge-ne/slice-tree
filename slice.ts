import type { Buffer } from "./buffer.ts";

export interface Slice {
  readonly buffer: Buffer;
  readonly start: number;
  count: number;
  lines: readonly number[];
}

export function create_slice(
  buffer: Buffer,
  start: number,
  count: number,
): Slice {
  return {
    buffer,
    start,
    count,
    lines: line_starts(buffer, start, count),
  };
}

export function split_slice(
  x: Slice,
  index: number,
  delete_count: number,
): Slice {
  const new_start = x.start + index + delete_count;
  const new_count = x.count - index - delete_count;

  x.count = index;
  x.lines = line_starts(x.buffer, x.start, index);

  return create_slice(x.buffer, new_start, new_count);
}

function line_starts(buffer: Buffer, start: number, count: number): number[] {
  const end = start + count;

  return buffer.line_breaks.filter((x) => (x.start >= start) && (x.start < end))
    .map((x) => x.end - start);
}
