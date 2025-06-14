import { SliceTree } from "../src/mod.ts";

import { lines, read_line } from "./utils.ts";

const N = 10 ** 3;

Deno.bench("Accessing a line in a SliceTree", {
  group: "Line",
  baseline: true,
}, (b) => {
  const text = new SliceTree(lines(N));

  b.start();

  for (let i = 0; i < N; i += 1) {
    const _ = text.read([i, 0], [i + 1, 0]);
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
