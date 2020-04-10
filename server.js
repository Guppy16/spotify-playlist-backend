const express = require('express');
const request = require('request');
const querystring = require('querystring');
const bodyParser = require('body-parser');

// const parseurl = require('parseurl');
// const path = require('path');
// const expressValidator = require('express-validator');

// NOTE: Need to SET SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET before running
// NOTE: Need to setup: SET DATABASE_URL=postgres://$(whoami)
// OR SET URL using: SET DATABASE_URL=$(heroku config:get DATABASE_URL -a your-app)


const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// pool.connect();

// pool.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

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

    // Add new person to DB when logged in
    request.get(
      {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      }, 
      async (error, response, body) => {
        const spotifyID = body.id;
        const username = body.display_name;
        try {
          const client = await pool.connect()
    
          // Search for spotifyID in table
          const result = await client.query('SELECT COUNT(1) FROM users WHERE userspotifyid LIKE ' + spotifyID);
          // Add person to table if necessary
          if (!result){await client.query(`INSERT INTO users VALUES (${spotifyID}, ${username})`);}
          res.json(result);
          client.release();
        } catch (err) {
          console.error(err);
          res.send("Error " + err);
        }
      }
    );

    
   


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

// Database function
app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    console.log(results);
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

// API FUNCTIONS

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URI || 'http://localhost:3000'); 
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true}));

// GET data from API (using spotify implementation)
app.get('/api/playlist', (req, res, next) => {
  // Get access toekn using query string
  // Refresh token? Somehwere else
  const accessToken = req.query.access_token;
  if (accessToken){
    // Get collabroative playlist data
    request.get({
      url: 'https://api.spotify.com/v1/playlists/7JJzP95ARTN2A08g7xahXD',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    }, 
    (error, response, body) => {
      // console.log(body);
      res.json(body);
      }
    );
  }else{
    res.redirect('/#' +
      querystring.stringify({
        error: 'invalid_token'
      }));
  }
});

// POST order of playlist
app.post('/api/playlist', (req, res, next) => {
  // Update table
  console.log(req.body);
  res.json(req.body);
});


let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)