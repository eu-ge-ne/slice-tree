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

  let from0 = 0;
  let to0 = to;
  let i = 0;
  let v = 0;

  while (from0 <= to0) {
    i = Math.trunc((from0 + to0) / 2);
    v = line_breaks[i]!.start;

    if (v < start) {
      from0 = i + 1;
    } else if (v > start) {
      to0 = i - 1;
    } else {
      from0 = i;
      break;
    }
  }

  let from1 = from0;

  to0 = to;

  while (from1 <= to0) {
    i = Math.trunc((from1 + to0) / 2);
    v = line_breaks[i]!.start;

    if (v < end) {
      from1 = i + 1;
    } else if (v > end) {
      to0 = i - 1;
    } else {
      to0 = i;
      break;
    }
  }

  return line_breaks.slice(from0, to0 + 1).map((x) => x.end - start);
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
