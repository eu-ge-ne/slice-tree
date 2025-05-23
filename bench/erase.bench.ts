import { SliceTree } from "../src/tree.ts";

import { str } from "./utils.ts";

const N = 10 ** 5;

Deno.bench("Trimming a SliceTree", {
  group: "Trim",
  baseline: true,
}, (b) => {
  const text = new SliceTree(str(N));

  b.start();

  for (let i = 0; i < N; i += 1) {
    text.erase(-1, 1);
  }

  b.end();
});

Deno.bench("Trimming a string", {
  group: "Trim",
}, (b) => {
  let text = str(N);

  b.start();

  for (let i = 0; i < N; i += 1) {
    text = text.slice(0, -1);
  }

  b.end();
});

Deno.bench("Deleting from a SliceTree", {
  group: "Delete",
  baseline: true,
}, (b) => {
  const text = new SliceTree(str(N));

  b.start();

  for (let i = 0; i < N; i += 1) {
    const pos = Math.trunc(text.count / 2);
    text.erase(pos, 1);
  }

  b.end();
});

Deno.bench("Deleting from a string", {
  group: "Delete",
}, (b) => {
  let text = str(N);

  b.start();

  for (let i = 0; i < N; i += 1) {
    const pos = Math.trunc(text.length / 2);
    text = text.slice(0, pos) + text.slice(pos + 1);
  }

  b.end();
});
