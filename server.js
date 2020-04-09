const express = require('express');
const request = require('request');
const querystring = require('querystring');

const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

const app = express();

const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback'

app.get('/', (req, res) => {
  res.json('You are in here!');
});

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  const code = req.query.code || null
  

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    const access_token = body.access_token;
    // const refresh_token = body.refresh_token;
    const uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


// API FUNCTIONS
// GET data from API (using spotify implementation)
app.get('/api/playlist', (req, res) => {
  accessToken = req.body.access_token

  // Get collabroative playlist data
  request.get({
      url: 'https://api.spotify.com/v1/playlists/7JJzP95ARTN2A08g7xahXD',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    }, 
    (error, response, body) => {
      console.log(body);
      res.json(body);
      }
  );
});

// POST order of playlist
app.post('api/playlist', (req, res) => {
  // Update table

});


let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)