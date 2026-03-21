#!/bin/bash

set -e

WORKSPACE_DIR="/workspaces/spark-template"
LATEST_RELEASE=$(curl -s https://api.github.com/repos/github/spark-template/releases/latest)
RELEASE_ID=$(echo "$LATEST_RELEASE" | jq -r '.id')


TEMP_DIR=/tmp/spark
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

DOWNLOAD_URL=$(echo "$LATEST_RELEASE" | jq -r '.assets[0].url')
if [ -z "$DOWNLOAD_URL" ] || [ "$DOWNLOAD_URL" = "null" ]; then
  echo "ERROR: No valid download URL found from spark-template releases." >&2
  exit 1
fi
curl -L -o "$TEMP_DIR/dist.zip" -H "Accept: application/octet-stream" "$DOWNLOAD_URL"

unzip -o "$TEMP_DIR/dist.zip" -d "$TEMP_DIR"
rm "$TEMP_DIR/dist.zip"

echo "$RELEASE_ID"