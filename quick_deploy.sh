git add --all
git commit -m 'quick deploy'
git push heroku master
heroku logs --tail
