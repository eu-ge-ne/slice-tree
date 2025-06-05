import { SliceTree } from "../src/tree.ts";

import { str } from "./utils.ts";

const N = 10 ** 6;

Deno.bench("Creating a SliceTree", {
  group: "Create",
  baseline: true,
}, () => {
  const _ = SliceTree.of_units(str(N));
});

Deno.bench("Creating a string", {
  group: "Create",
}, () => {
  const _ = str(N);
});
