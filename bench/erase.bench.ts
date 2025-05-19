import { SliceTree } from "../src/tree.ts";

function str(n: number): string {
  let str = "";
  while (str.length < n) {
    str += crypto.randomUUID().slice(0, n - str.length);
  }
  return str;
}

for (let power = 4; power < 7; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Erasing ${n} chars sequentially from a SliceTree`,
    {
      group: `Erase sequential x${n}`,
      baseline: true,
    },
    (b) => {
      const text = new SliceTree(str(n));

      b.start();

      for (let i = 1; i <= n; i += 1) {
        text.erase(0, 1);
      }

      b.end();
    },
  );

  Deno.bench(
    `Erasing ${n} chars sequentially from a string`,
    {
      group: `Erase sequential x${n}`,
    },
    (b) => {
      let text = str(n);

      b.start();

      for (let i = 1; i <= n; i += 1) {
        text = text.slice(1);
      }

      b.end();
    },
  );
}
