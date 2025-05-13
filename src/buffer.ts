import { create_eols, type EOL } from "./eol.ts";

export interface Buffer {
  text: string;
  readonly eols: EOL[];
}

export function create_buffer(text: string): Buffer {
  return {
    text,
    eols: create_eols(text).toArray(),
  };
}

export function grow_buffer(buffer: Buffer, text: string): void {
  for (const eol of create_eols(text, buffer.text.length)) {
    buffer.eols.push(eol);
  }

  buffer.text += text;
}
