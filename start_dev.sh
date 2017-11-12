./stop_dev.sh
bundle exec jekyll serve &
sass --watch --style compressed assets/css/style.scss:_includes/style.min.css &
