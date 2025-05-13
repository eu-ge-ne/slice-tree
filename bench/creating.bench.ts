import { SliceTree } from "../src/tree.ts";

Deno.bench(
  "Creating a SliceTree",
  {
    group: "Creating",
    baseline: true,
  },
  () => {
    const _ = new SliceTree(crypto.randomUUID());
  },
);

Deno.bench(
  "Creating a string",
  {
    group: "Creating",
  },
  () => {
    const _ = crypto.randomUUID();
  },
);
