import { create_eols, type EOL } from "./eol.ts";

export interface Buffer {
  text: string;
  char_count: number;
  readonly eols: EOL[];
}

export function create_buffer(text: string): Buffer {
  const char_count = count_chars(text);
  const eols = create_eols(text);

  return {
    text,
    char_count,
    eols,
  };
}

export function grow_buffer(buffer: Buffer, text: string): void {
  // TODO: optimise
  for (const eol of create_eols(text, buffer.char_count)) {
    buffer.eols.push(eol);
  }

  buffer.text += text;
  buffer.char_count += count_chars(text);
}

function count_chars(text: string): number {
  let char_count = 0;

  for (const _ of text) {
    char_count += 1;
  }

  return char_count;
}
