const LINE_BREAKS_RE = /r?\n/gm;

interface Pool {
  readonly buffers: Buffer[];
}

interface LineBreaks {
  start: number;
  end: number;
}

export interface Buffer {
  text: string;
  line_breaks: readonly LineBreaks[];
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
  line_breaks: readonly LineBreaks[],
  start: number,
  length: number,
): number[] {
  const end = start + length - 1;
  const to = line_breaks.length - 1;

  let a = 0;
  let c = to;
  let i = 0;
  let v = 0;

  while (a <= c) {
    i = Math.trunc((a + c) / 2);
    v = line_breaks[i]!.start;

    if (v < start) {
      a = i + 1;
    } else if (v > start) {
      c = i - 1;
    } else {
      a = i;
      break;
    }
  }

  let b = a;

  c = to;

  while (b <= c) {
    i = Math.trunc((b + c) / 2);
    v = line_breaks[i]!.start;

    if (v < end) {
      b = i + 1;
    } else if (v > end) {
      c = i - 1;
    } else {
      c = i;
      break;
    }
  }

  return line_breaks.slice(a, c + 1).map((x) => x.end - start);
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
