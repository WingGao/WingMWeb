#!/usr/bin/env bash
export MOD_PATH=`pwd`/WingMWeb
export NODE_PATH=$NODE_PATH:$MOD_PATH/node_modules
cd WingMWeb
./node_modules/.bin/webpack --config ../gulp_config.wing.js
