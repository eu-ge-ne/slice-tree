import { create_eols, type EOL } from "./eol.ts";

interface Pool {
  readonly buffers: Buffer[];
}

export interface Buffer {
  text: string;
  eols: readonly EOL[];
}

export function create_buffer(pool: Pool, text: string): Buffer {
  const buffer = {
    text,
    eols: create_eols(text),
  };

  pool.buffers.push(buffer);

  return buffer;
}

export function add_to_buffer(buffer: Buffer, text: string): void {
  const eols = create_eols(text, buffer.text.length);

  buffer.text += text;
  buffer.eols = buffer.eols.concat(eols);
}
