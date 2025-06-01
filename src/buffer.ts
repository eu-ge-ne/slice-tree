import { add_eols, type EOL } from "./eol.ts";
import { count_chars } from "./unicode.ts";

export interface Buffer {
  text: string;
  char_count: number;
  readonly eols: EOL[];
}

export function create_buffer(text: string): Buffer {
  const char_count = count_chars(text);

  const eols: EOL[] = [];

  add_eols(eols, text);

  return {
    text,
    char_count,
    eols,
  };
}

export function grow_buffer(buffer: Buffer, text: string): void {
  add_eols(buffer.eols, text, buffer.char_count);

  buffer.text += text;
  buffer.char_count += count_chars(text);
}

export function slice_buffer(
  buffer: Buffer,
  start: number,
  end: number,
): string {
  let i = 0;

  let s = 0;
  for (const char of buffer.text) {
    if (i === start) {
      break;
    }
    i += 1;
    s += char.length;
  }

  const t = buffer.text.slice(s);

  i = 0;

  let e = 0;
  for (const char of t) {
    if (i === (end - start)) {
      break;
    }
    i += 1;
    e += char.length;
  }

  return t.slice(0, e);
}
