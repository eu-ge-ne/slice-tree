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

export function eol_index(eols: readonly EOL[], index: number): number {
  let i = 0;

  for (; i < eols.length; i += 1) {
    if (eols[i]!.start >= index) {
      break;
    }
  }

  return i;
}

export function eols_slice_length(
  eols: readonly EOL[],
  slice_end: number,
  start: number,
): number {
  slice_end -= 1;

  let a = start;
  let b = eols.length - 1;
  let i = 0;
  let v = 0;

  while (a <= b) {
    i = Math.trunc((a + b) / 2);
    v = eols[i]!.start;

    if (v < slice_end) {
      a = i + 1;
    } else if (v > slice_end) {
      b = i - 1;
    } else {
      b = i;
      break;
    }
  }

  return b + 1 - start;
}
