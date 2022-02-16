#!/bin/sh
cd /home/marco && \
pm2 start ./dist/server.js --name="dashboard" -i $INSTANCE && \
pm2 logs