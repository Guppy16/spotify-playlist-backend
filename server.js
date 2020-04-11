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
        try {
          const spotifyID = body.id;
          const username = body.display_name;
          const client = await pool.connect();

          // Search for spotifyID in table
          const result = await client.query(`SELECT COUNT(1) FROM users WHERE userspotifyid LIKE '${spotifyID}'`);
          // Add person to table if necessary
          if (!parseInt(result.rows[0].count)){await client.query(`INSERT INTO users VALUES ('${spotifyID}', '${username}')`);}
          client.release();
        } catch (err) {
          console.error(err);
          // res.send("ERROR! " + err); // not working? maybe add this as json?
        }
      }
    )

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

// Database model function
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

// Database to retreive songs
app.get('/db/songs', async (req, res) => {
  
  // Get access token to get playlist details
  const accessToken = req.query.access_token;
  if (accessToken){
    // Get collabroative playlist data
    request.get({
      url: 'https://api.spotify.com/v1/playlists/7JJzP95ARTN2A08g7xahXD',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    }, 
    async (error, response, body) => {
      // console.log(body);
      const songs = body.tracks.items.map( item => ({
        id: item.track.id,
        name: item.track.name,
        timestamp: item.added_at,
        user: item.added_by.id,
        duration: Math.round(item.track.duration_ms / 1000),
      }));

      //res.json(body);
      try {
        const client = await pool.connect()
        // Add songs to database
        await client.query('DELETE FROM songs');
        songs.forEach( async (song) => { // May need async with await
          await client.query(`INSERT INTO songs VALUES ('${song.id}','${song.name}','${song.timestamp}','${song.user}','${song.duration}')`);
        })
        const result = await client.query('SELECT * FROM songs');
        const results = { 'results': (result) ? result.rows : null};
        console.log(results);
        res.json(results);
        client.release();
      } catch (err) {
        console.error(err);
        res.send("Error " + err);
      }
      
      }
    );
  }else{
    res.redirect('/#' +
      querystring.stringify({
        error: 'invalid_token'
      }));
  }


  
})

// UTIL functions

// API FUNCTIONS

// USE functions to attach to headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URI || 'http://localhost:3000'); 
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true}));

// GET data from API (using spotify implementation)
app.get('/api/playlist', async (req, res, next) => {

  console.log('Getting data from playlist api');

  // NOTE: may need to query based on timestamp LATER
  try {
    const userid = req.query.user_id; // Get userid from body
    const client = await pool.connect()

    // Query all songs with userid in song_user_score
    const userSongIds = await client.query(`SELECT songid FROM song_user_score WHERE userid LIKE '${userid}'`);
    console.log('\nUSER SONG IDS\n');
    console.log(userSongIds);

    console.log('\nUSER SONG IDS.ROWS\n');
    console.log(userSongIds.rows);

    // Query all songid in songs
    const allSongIds = await client.query(`SELECT songid FROM songs`);
    console.log('\nALL SONGS\n');
    console.log(allSongIds);

    console.log('\nALL SONG IDS.ROWS:\n');
    console.log(allSongIds.rows)

    // Add missing songs in score 
    allSongIds.rows.forEach( async (song) => {
      if(!userSongIds.rows.includes(song.songid)){
        await client.query(`INSERT INTO song_user_score VALUES ('${song.songid}', '${userid}', '0', '${new Date().toISOString()}')`);
      }
    })

    // Use join query to get song_id, duration, score
    // Requery songs in song_user_score
    const userSongScore = await client.query(`SELECT * FROM song_user_score WHERE userid LIKE '${userid}'`);

    const results = { 'results': (userSongScore) ? userSongScore.rows : null};
    console.log(results);
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    //res.send("Error " + err);
  } finally {
      // If didn't work, get data from spotify api
    // Get access token using query string
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
          error: 'invalid_token and invalid user_id'
        }));
    }
  }
  
});

// POST order of playlist
app.post('/api/playlist', async (req, res, next) => {
  console.log(req.body);
  // Update table
  try {
    const client = await pool.connect()

    // Assume score already added (through get method when getting playlist)
    // for now search for all songs scored after 10/4 by user:
    const result = await client.query('SELECT * FROM song_user_score');

    // THEN UPDATE records

    //const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    console.log(results);
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
  res.json(req.body);
});


let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)