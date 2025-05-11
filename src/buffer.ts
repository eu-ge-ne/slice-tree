import { create_eols, type EOL } from "./eol.ts";

interface Pool {
  readonly buffers: Buffer[];
}

export interface Buffer {
  text: string;
  eols: EOL[];
}

export function create_buffer(pool: Pool, text: string): Buffer {
  const buffer = {
    text,
    eols: create_eols(text).toArray(),
  };

  pool.buffers.push(buffer);

  return buffer;
}

export function add_to_buffer(buffer: Buffer, text: string): void {
  const eols = create_eols(text, buffer.text.length);

  buffer.text += text;

  for (const eol of eols) {
    buffer.eols.push(eol);
  }
}
