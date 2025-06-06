import { SliceTree } from "../src/tree.ts";

import { lines, read_line } from "./utils.ts";

const N = 10 ** 3;

Deno.bench("Accessing a line in a SliceTree", {
  group: "Line",
  baseline: true,
}, (b) => {
  const text = SliceTree.units(lines(N));

  b.start();

  for (let i = 0; i < N; i += 1) {
    const _ = text.read_line(i).toArray().join("");
  }

  b.end();
});

Deno.bench("Accessing a line in a string", {
  group: "Line",
}, (b) => {
  const text = lines(N);

  b.start();

  for (let i = 0; i < N; i += 1) {
    const _ = read_line(text, i);
  }

  b.end();
});
