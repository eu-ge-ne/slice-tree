#! /bin/bash

rm -rf ./coverage
deno test --coverage
open coverage/html/index.html
