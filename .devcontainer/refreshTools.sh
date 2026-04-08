#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="${WORKSPACE_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
LATEST_RELEASE=$(curl -s https://api.github.com/repos/github/spark-template/releases/latest)
RELEASE_ID=$(echo "$LATEST_RELEASE" | jq -r '.id')


TEMP_DIR=/tmp/spark
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

DOWNLOAD_URL=$(echo "$LATEST_RELEASE" | jq -r '.assets[0].url')
curl -L -o "$TEMP_DIR/dist.zip" -H "Accept: application/octet-stream" "$DOWNLOAD_URL"

unzip -o "$TEMP_DIR/dist.zip" -d "$TEMP_DIR"
rm "$TEMP_DIR/dist.zip"

echo "$RELEASE_ID"