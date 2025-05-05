const LINE_BREAKS_RE = /r?\n/gm;

interface Pool {
  readonly buffers: Buffer[];
}

export interface Buffer {
  text: string;
  line_breaks: readonly { start: number; end: number }[];
}

export function buffer_text(
  pool: Pool,
  text: string,
): [Buffer, number, number] {
  /*
  let buffer = pool.buffers.at(-1);

  const start = buffer?.text.length ?? 0;
  const count = text.length;

  if (buffer) {
    add_to_buffer(buffer, text);
  } else {
    buffer = create_buffer(pool, text);
  }
  */
  const buffer = create_buffer(pool, text);

  return [buffer, 0, text.length];
}

function create_buffer(pool: Pool, text: string): Buffer {
  const buffer = {
    text,
    line_breaks: line_breaks(text),
  };

  pool.buffers.push(buffer);

  return buffer;
}

function add_to_buffer(buffer: Buffer, text: string): void {
  buffer.text += text;
  buffer.line_breaks = line_breaks(buffer.text);
}

function line_breaks(text: string): { start: number; end: number }[] {
  return Array.from(text.matchAll(LINE_BREAKS_RE)).map((x) => ({
    start: x.index,
    end: x.index + x[0].length,
  }));
}
