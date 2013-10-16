#!/bin/bash

echo "Bulk-inserting the $1 docs from STDIN..." && \
(echo '{"docs":'; cat -; echo '}') | curl -f -H 'Content-Type: application/json' -d @- -X POST "http://127.0.0.1:5984/$1/_bulk_docs" && \
echo 'Done.'
