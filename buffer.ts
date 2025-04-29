const LINE_BREAKS_RE = /r?\n/gm;

export interface Buffer {
  readonly text: string;
  readonly line_breaks: readonly { start: number; end: number }[];
}

export function create_buffer(text: string): Buffer {
  const matches = Array.from(text.matchAll(LINE_BREAKS_RE));

  const line_breaks = matches.map((x) => ({
    start: x.index,
    end: x.index + x[0].length,
  }));

  return {
    text,
    line_breaks,
  };
}
