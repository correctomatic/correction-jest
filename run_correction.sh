#! /usr/bin/env sh
SCRIPT_TO_RUN="./correct_exercise.js"

./copy_files.sh

# Check if copy was successful
if [ $? -eq 0 ]; then
  # Run the JavaScript file
  node "$SCRIPT_TO_RUN"
else
  echo '{"success":false,"error":"Could not copy the file"}'
fi
