import { add_eols, type EOL } from "./eol.ts";

export interface Buffer {
  _text: string;
  char_count: number;
  readonly eols: EOL[];
}

export function create_buffer(text: string): Buffer {
  const char_count = [...text].length;

  const eols: EOL[] = [];

  add_eols(eols, text);

  return {
    _text: text,
    char_count,
    eols,
  };
}

export function grow_buffer(buffer: Buffer, text: string): void {
  add_eols(buffer.eols, text, buffer.char_count);

  buffer._text += text;
  buffer.char_count += [...text].length;
}

export function slice_buffer(
  buffer: Buffer,
  start: number,
  end: number,
): string {
  let i = 0;
  let a = 0;
  let b = 0;

  for (const char of buffer._text) {
    if (i < start) {
      a += char.length;
      i += 1;
    } else if (i < end) {
      b += char.length;
      i += 1;
    } else {
      break;
    }
  }

  return buffer._text.slice(a, a + b);
}
