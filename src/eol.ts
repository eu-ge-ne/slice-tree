const LINE_BREAKS_RE = /r?\n/gm;

export interface EOL {
  start: number;
  end: number;
}

export function create_eols(text: string, start = 0): EOL[] {
  return Array.from(text.matchAll(LINE_BREAKS_RE)).map((x) => ({
    start: start + x.index,
    end: start + x.index + x[0].length,
  }));
}

export function slice_eols(
  eols: readonly EOL[],
  start: number,
  length: number,
): {
  readonly eols_start: number;
  readonly eols_length: number;
} {
  const end = start + length - 1;
  const to = eols.length - 1;

  let a = 0;
  let c = to;
  let i = 0;
  let v = 0;

  while (a <= c) {
    i = Math.trunc((a + c) / 2);
    v = eols[i]!.start;

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
    v = eols[i]!.start;

    if (v < end) {
      b = i + 1;
    } else if (v > end) {
      c = i - 1;
    } else {
      c = i;
      break;
    }
  }

  //return line_breaks.slice(a, c + 1).map((x) => x.end - start);
  return {
    eols_start: a,
    eols_length: c + 1 - a,
  };
}
