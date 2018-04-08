# Remove any existing processes
lsof -n -i4TCP:4000 | grep LISTEN | awk '{print $2}' | xargs kill
ps ax | grep sass | awk '{print $1}' | xargs kill

# Start current dev session
trap 'kill %1' SIGINT
bundle exec jekyll serve --incremental & node_modules/.bin/node-sass --watch --output-style compressed assets/css/style.scss _includes/style.min.css
