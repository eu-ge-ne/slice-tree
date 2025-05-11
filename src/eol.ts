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

export function eols_slice_start(
  eols: readonly EOL[],
  slice_start: number,
): number {
  let a = 0;
  let b = eols.length - 1;
  let i = 0;
  let v = 0;

  while (a <= b) {
    i = Math.trunc((a + b) / 2);
    v = eols[i]!.start;

    if (v < slice_start) {
      a = i + 1;
    } else if (v > slice_start) {
      b = i - 1;
    } else {
      return i;
    }
  }

  return a;
}

export function eols_slice_length(
  eols: readonly EOL[],
  slice_start: number,
  slice_length: number,
  slice_eols_start: number,
): number {
  const slice_end = slice_start + slice_length - 1;

  let a = slice_eols_start;
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

  return b + 1 - slice_eols_start;
}
