import { SliceTree } from "../src/tree.ts";

Deno.bench("Creating a SliceTree", {
  group: "Create",
  baseline: true,
}, () => {
  const _ = new SliceTree(crypto.randomUUID());
});

Deno.bench("Creating a string", {
  group: "Create",
}, () => {
  const _ = crypto.randomUUID();
});
