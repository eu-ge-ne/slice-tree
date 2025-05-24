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

export function find_eol_index(
  eols: readonly EOL[],
  start: number,
  index: number,
): number {
  let a = start;
  let b = eols.length - 1;
  let i = 0;
  let v = 0;

  while (a <= b) {
    i = Math.trunc((a + b) / 2);
    v = eols[i]!.start;

    if (v < index) {
      a = i + 1;
    } else if (v > index) {
      b = i - 1;
    } else {
      break;
    }
  }

  return a;
}
