./stop_dev.sh
bundle exec jekyll serve &
sass --watch --style compressed --sourcemap=none assets/css/style.scss:_includes/style.min.css &
