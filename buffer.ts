const LINE_BREAKS_RE = /r?\n/gm;

interface Pool {
  readonly buffers: Buffer[];
}

export interface Buffer {
  readonly text: string;
  readonly line_breaks: readonly { start: number; end: number }[];
}

export function create_buffer(pool: Pool, text: string): Buffer {
  const buffer = {
    text,
    line_breaks: line_breaks(0, text),
  };

  pool.buffers.push(buffer);

  return buffer;
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
