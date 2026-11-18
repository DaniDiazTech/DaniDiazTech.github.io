#!/usr/bin/env bash
set -euo pipefail
lab_dir="$(cd "$(dirname "$0")/../labs" && pwd)"
lab_build="$(mktemp -d)"
trap 'rm -rf "$lab_build"' EXIT
for lab in orientation gradient autodiff xor tensor bigram attention; do
  clang++ -std=c++20 -O2 -Wall -Wextra -Wpedantic "$lab_dir/$lab.cpp" -o "$lab_build/$lab"
  "$lab_build/$lab"
done
