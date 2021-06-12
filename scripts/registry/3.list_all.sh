#!/usr/bin/env bash
set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1

echo
echo 'About to call list_all() on the contract'
echo near call \$CONTRACT list_all '{}' --account_id \$CONTRACT
echo
echo \$CONTRACT is $CONTRACT
echo
near call $CONTRACT list_all '{}' --account_id $CONTRACT
