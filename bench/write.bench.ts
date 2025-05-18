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

for (let power = 2; power < 5; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Inserting ${n} chars sequentially into a SliceTree`,
    {
      group: `Insert sequential x${n}`,
      baseline: true,
    },
    (b) => {
      const text = new SliceTree(crypto.randomUUID());
      text.write(text.count, crypto.randomUUID());

      let pos = 36;

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
      group: `Insert sequential x${n}`,
    },
    (b) => {
      let text = crypto.randomUUID() + crypto.randomUUID();

      let pos = 36;

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
      group: `Insert interleaved x${n}`,
      baseline: true,
    },
    (b) => {
      const text = new SliceTree(crypto.randomUUID());

      let pos = Math.trunc(text.count / 2);

      b.start();

      for (let i = 0; i < n; i += 1) {
        text.write(pos, crypto.randomUUID());
        pos = Math.trunc(text.count / 2);
      }

      b.end();
    },
  );

  Deno.bench(
    `Inserting ${n} chars interleaved into a string`,
    {
      group: `Insert interleaved x${n}`,
    },
    (b) => {
      let text = crypto.randomUUID();

      let pos = Math.trunc(text.length / 2);

      b.start();

      for (let i = 0; i < n; i += 1) {
        text = text.slice(0, pos) + crypto.randomUUID() + text.slice(pos);
        pos = Math.trunc(text.length / 2);
      }

      b.end();
    },
  );
}
