const LINE_BREAKS_RE = /r?\n/gm;

interface Pool {
  readonly buffers: Buffer[];
}

export interface Buffer {
  text: string;
  line_breaks: readonly { start: number; end: number }[];
}

export function create_buffer(pool: Pool, text: string): Buffer {
  const buffer = {
    text,
    line_breaks: line_breaks(0, text),
  };

  pool.buffers.push(buffer);

  return buffer;
}

export function add_to_buffer(buffer: Buffer, text: string): void {
  const new_line_breaks = line_breaks(buffer.text.length, text);

  buffer.text += text;
  buffer.line_breaks = buffer.line_breaks.concat(new_line_breaks);
}

export function line_starts(
  buffer: Buffer,
  start: number,
  length: number,
): number[] {
  const end = start + length - 1;

  let from = 0;
  let to = buffer.line_breaks.length - 1;
  let i = 0;
  let v = 0;

  while (from <= to) {
    i = Math.trunc((from + to) / 2);
    v = buffer.line_breaks[i]!.start;

    if (v < start) {
      from = i + 1;
    } else if (v > start) {
      to = i - 1;
    } else {
      from = i;
      break;
    }
  }

  const i0 = from;

  to = buffer.line_breaks.length - 1;

  while (from <= to) {
    i = Math.trunc((from + to) / 2);
    v = buffer.line_breaks[i]!.start;

    if (v < end) {
      from = i + 1;
    } else if (v > end) {
      to = i - 1;
    } else {
      to = i;
      break;
    }
  }

  const i1 = to + 1;

  return buffer.line_breaks.slice(i0, i1).map((x) => x.end - start);
}

function line_breaks(
  start: number,
  text: string,
): { start: number; end: number }[] {
  return Array.from(text.matchAll(LINE_BREAKS_RE)).map((x) => ({
    start: start + x.index,
    end: start + x.index + x[0].length,
  }));
}
