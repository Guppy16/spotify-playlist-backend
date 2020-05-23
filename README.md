## Goal
Backend server to allow client access to songs from shared spotify playlist

## TO DO
- Prevent users from selecting their own songs

# Helpful commands
May need this command to pull remote DB:

PGUSER=postgres PGPASSWORD=password heroku pg:pull HEROKU_POSTGRESQL_MAGENTA mylocaldb --app sushi

or this:

heroku pg:pull HEROKU_POSTGRESQL_MAGENTA mylocaldb --app sushi \

To push local DB to remote:

heroku pg:push mylocaldb HEROKU_POSTGRESQL_MAGENTA --app sushi


## Development mode

In development mode, it assumes you are running the frontend on localhost:3000, but the server itself will be running on localhost:8888.

In order to start developing, register a Spotify Application here:
https://developer.spotify.com/my-applications

On that page, add http://localhost:8888 as a callback url (don't forget to hit save at the bottom of the page)

Change environment variables by creating a file `.env`, which mimicks the contents of the `.env.default` file

Then go to http://localhost:8888/login in your browser. This will initiate the login flow and finally redirect to http://localhost:3000?access_token=ZZZZZ where ZZZZZ is a valid access token that you can use to do operations in the Spotify API.

## Deploying to production

This template is indended to be deployed on Heroku. After installing the heroku CLI tools you can run the below commands in the same directory as server.js(replacing abc123, cba456, mybackend and myfrontend with your actual stuff - the below example assume that you already have your frontend running on http://myfrontend.herokuapp.com.

```
heroku create mybackend
heroku config:set SPOTIFY_CLIENT_ID=abc123
heroku config:set SPOTIFY_CLIENT_SECRET=cba456
heroku config:set REDIRECT_URI=https://mybackend.herokuapp.com/callback
heroku config:set FRONTEND_URI=https://myfrontend.herokuapp.com
git push heroku master
```

You should now be able to go to http://mybackend.herokuapp.com/login and it will eventually redirect to http://myfrontend.herokuapp.com?access_token=ZZZZZwhere ZZZZZ is a valid access token that you can use to do operations in the Spotify API.
