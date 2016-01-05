lsof -n -i4TCP:4000 | grep LISTEN | awk '{print $2}' | xargs kill
ps ax | grep /usr/local/bin/sass | awk '{print $1}' | xargs kill
