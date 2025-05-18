import { SliceTree } from "../src/tree.ts";

for (let power = 2; power < 5; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Inserting ${n} chars sequentially into a SliceTree`,
    {
      group: `Insertion sequential x${n}`,
      baseline: true,
    },
    (b) => {
      const text = new SliceTree(" ");
      text.write(text.count, " ");

      let pos = 1;

      b.start();

      for (let i = 0; i < n; i += 1) {
        text.write(pos, crypto.randomUUID());
        pos += 36;
      }

      b.end();
    },
  );

  Deno.bench(
    `Inserting ${n} chars sequentially into a string`,
    {
      group: `Insertion sequential x${n}`,
    },
    (b) => {
      let text = " " + " ";

      let pos = 1;

      b.start();

      for (let i = 0; i < n; i += 1) {
        text = text.slice(0, pos) + crypto.randomUUID() + text.slice(pos);
        pos += 36;
      }

      b.end();
    },
  );
}

for (let power = 2; power < 5; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Inserting ${n} chars interleaved into a SliceTree`,
    {
      group: `Insertion interleaved x${n}`,
      baseline: true,
    },
    (b) => {
      const text = new SliceTree("  ");

      let pos = 1;

      b.start();

      for (let i = 0; i < n; i += 1) {
        text.write(pos, crypto.randomUUID());
        pos += 1;
      }

      b.end();
    },
  );

  Deno.bench(
    `Inserting ${n} chars interleaved into a string`,
    {
      group: `Insertion interleaved x${n}`,
    },
    (b) => {
      let text = "  ";

      let pos = 1;

      b.start();

      for (let i = 0; i < n; i += 1) {
        text = text.slice(0, pos) + crypto.randomUUID() + text.slice(pos);
        pos += 1;
      }

      b.end();
    },
  );
}
