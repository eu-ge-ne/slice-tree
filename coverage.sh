#! /bin/bash

rm -rf ./coverage
deno test --doc --coverage
open coverage/html/index.html
