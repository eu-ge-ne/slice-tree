#! /bin/bash

rm -rf ./coverage
deno test --coverage
deno coverage --lcov --output=coverage/cov.lcov
genhtml -o coverage/html coverage/cov.lcov
open coverage/html/index.html
