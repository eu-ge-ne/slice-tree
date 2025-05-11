const LINE_BREAKS_RE = /r?\n/gm;

export interface EOL {
  readonly start: number;
  readonly end: number;
}

export function create_eols(text: string, start = 0): IteratorObject<EOL> {
  return text.matchAll(LINE_BREAKS_RE).map((x) => ({
    start: start + x.index,
    end: start + x.index + x[0].length,
  }));
}

export function eols_slice_start(eols: readonly EOL[], start: number): number {
  let a = 0;
  let b = eols.length - 1;
  let i = 0;
  let v = 0;

  while (a <= b) {
    i = Math.trunc((a + b) / 2);
    v = eols[i]!.start;

    if (v < start) {
      a = i + 1;
    } else if (v > start) {
      b = i - 1;
    } else {
      return i;
    }
  }

  return a;
}

export function eols_slice_length(
  eols: readonly EOL[],
  start: number,
  length: number,
  a: number,
): number {
  const end = start + length - 1;

  let b = a;
  let c = eols.length - 1;
  let i = 0;
  let v = 0;

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

  return c + 1 - a;
}
