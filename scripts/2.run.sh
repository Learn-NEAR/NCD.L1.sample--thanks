#!/usr/bin/env bash
set -e

echo
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo

# these functions are all "view" functions so they don't require a signature
near view $CONTRACT showYouKnow     # this one returns false (function return value is void)
near view $CONTRACT showYouKnow2    # this one returns true
near view $CONTRACT sayHello        # this one returns a literal string

# ------------------------
# the next method uses a host function to retrieve the caller's name so it needs to be a CHANGE function (using "call" here)
# you can read more about host function restrictions here: https://docs.near.org/docs/develop/contracts/as/intro#view-and-change-functions
# ----
# near view $CONTRACT sayMyName
# ----
# so this is the solution, to replace "view" with "call" and include a signer
near call $CONTRACT sayMyName --account_id $OWNER
# ------------------------

# ------------------------
# the next method writes to storage.  storage is structured as key-value pairs
near call $CONTRACT saveMyName --account_id $OWNER
# ------------------------


# ------------------------
# these methods use a collection wrapper around blockchain storage
# you can read more about collections here: https://docs.near.org/docs/concepts/data-storage
near call $CONTRACT saveMyMessage '{"message":"hey again"}' --account_id $OWNER
near call $CONTRACT getAllMessages --account_id $OWNER
# ------------------------
