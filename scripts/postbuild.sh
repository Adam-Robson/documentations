#!/bin/bash

set -e

DIST="dist/index.js"

if [[ ! -f "$DIST" ]]; then
  echo "$DIST not found. Run the build script first."
  exit 1
fi

echo "#!/usr/bin/env node" | cat - "$DIST" > tmp

mv tmp "$DIST"
chmod +x "$DIST" 

echo "Post-build script completed. Shebang added to $DIST."

