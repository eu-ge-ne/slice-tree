export interface EOL {
  readonly start: number;
  readonly end: number;
}

export function add_eols(eols: EOL[], text: string, start = 0): void {
  let i = 0;
  let prev: string | undefined;

  for (const char of text) {
    if (char === "\n") {
      eols.push({
        start: start + i - (prev === "\r" ? 1 : 0),
        end: start + i + 1,
      });
    }

    prev = char;
    i += 1;
  }
}

export function find_eol(
  eols: readonly EOL[],
  eols_start: number,
  index: number,
): number {
  let a = eols_start;
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
      a = i;
      break;
    }
  }

  return a;
}
