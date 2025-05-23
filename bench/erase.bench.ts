import { SliceTree } from "../src/tree.ts";

import { for_exp, str } from "./utils.ts";

for_exp(4, 7, (n) => {
  Deno.bench(`Erasing ${n} chars sequentially from a SliceTree`, {
    group: `Erase sequential x${n}`,
    baseline: true,
  }, (b) => {
    const text = new SliceTree(str(n));

    b.start();

    for (let i = 1; i <= n; i += 1) {
      text.erase(0, 1);
    }

    b.end();
  });

  Deno.bench(`Erasing ${n} chars sequentially from a string`, {
    group: `Erase sequential x${n}`,
  }, (b) => {
    let text = str(n);

    b.start();

    for (let i = 1; i <= n; i += 1) {
      text = text.slice(1);
    }

    b.end();
  });
});

for_exp(3, 6, (n) => {
  Deno.bench(`Erasing ${n} chars interleaved from a SliceTree`, {
    group: `Erase interleaved x${n}`,
    baseline: true,
  }, (b) => {
    const text = new SliceTree(str(n * 2));

    let pos = 0;

    b.start();

    for (let i = 1; i <= n; i += 1) {
      text.erase(pos, 1);
      pos += 2;
    }

    b.end();
  });

  Deno.bench(`Erasing ${n} chars interleaved from a string`, {
    group: `Erase interleaved x${n}`,
  }, (b) => {
    let text = str(n * 2);

    let pos = 0;

    b.start();

    for (let i = 1; i <= n; i += 1) {
      text = text.slice(0, pos) + text.slice(pos + 1);
      pos += 2;
    }

    b.end();
  });
});
