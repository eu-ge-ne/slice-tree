import { SliceTree } from "../src/tree.ts";

Deno.bench(
  "Creating a SliceTree",
  {
    group: "Creation",
    baseline: true,
  },
  () => {
    const _ = new SliceTree(crypto.randomUUID());
  },
);

Deno.bench(
  "Creating a string",
  {
    group: "Creation",
  },
  () => {
    const _ = crypto.randomUUID();
  },
);
