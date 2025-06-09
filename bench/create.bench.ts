import { SliceTree } from "../src/mod.ts";

import { str } from "./utils.ts";

const N = 10 ** 6;

Deno.bench("Creating a SliceTree", {
  group: "Create",
  baseline: true,
}, () => {
  const _ = new SliceTree(str(N));
});

Deno.bench("Creating a string", {
  group: "Create",
}, () => {
  const _ = str(N);
});
