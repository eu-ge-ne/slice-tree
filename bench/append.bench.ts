import { SliceTree } from "../src/tree.ts";

for (let power = 3; power < 6; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Appending ${n} chars into a SliceTree`,
    {
      group: `Append x${n}`,
      baseline: true,
    },
    (b) => {
      const text = new SliceTree();

      b.start();

      for (let i = 0; i < n; i += 1) {
        text.write(text.count, crypto.randomUUID());
      }

      b.end();
    },
  );

  Deno.bench(
    `Appending ${n} chars into a string`,
    {
      group: `Append x${n}`,
    },
    (b) => {
      let text = "";

      b.start();

      for (let i = 0; i < n; i += 1) {
        text += crypto.randomUUID();
      }

      b.end();
    },
  );
}
