#!/bin/bash

NODE_IMAGE="daocasino/blockchain:gos-v1"

docker run --rm -it --network=host $NODE_IMAGE /opt/haya/bin/haya-cli --wallet-url=http://localhost:8899 "$@"
