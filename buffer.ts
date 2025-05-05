const LINE_BREAKS_RE = /r?\n/gm;

interface Pool {
  readonly buffers: Buffer[];
}

export interface Buffer {
  text: string;
  line_breaks: { start: number; end: number }[];
}

export function buffer_text(
  pool: Pool,
  text: string,
): [Buffer, number, number] {
  let buffer = pool.buffers.at(-1);

  if (buffer && buffer.text.length < 100) {
    const start = buffer.text.length;

    buffer.text += text;

    const breaks = line_breaks(start, text);

    if (breaks.length > 0) {
      buffer.line_breaks = buffer.line_breaks.concat(breaks);
    }

    return [buffer, start, text.length];
  } else {
    buffer = {
      text,
      line_breaks: line_breaks(0, text),
    };

    pool.buffers.push(buffer);

    return [buffer, 0, text.length];
  }
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
