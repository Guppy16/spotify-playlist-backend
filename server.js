const express = require('express');
const request = require('request');
const querystring = require('querystring');
const bodyParser = require('body-parser');
require('dotenv').config();

const testData = {
  "songScores": [{ "songid": "2i63MeQVdPuLvDH4EdaqXO", "songname": "Undercover Martyn", "addedbyuserid": "danishmalik01", "username": "danishmalik01", "score": 7, "userScore": "-" }, { "songid": "0LtOwyZoSNZKJWHqjzADpW", "songname": "Feels Like We Only Go Backwards", "addedbyuserid": "danishmalik01", "username": "danishmalik01", "score": 5, "userScore": "-" }, { "songid": "6TWei3RfHaDYEC8EgVvTST", "songname": "life? ... lol", "addedbyuserid": "vishukethees", "username": "vishukethees", "score": 4, "userScore": "-" }, { "songid": "0VJu2YKyBXyCFVE6cZaGpS", "songname": "Flex (feat. JB Scofield)", "addedbyuserid": "vishukethees", "username": "vishukethees", "score": 3, "userScore": "-" }, { "songid": "0uxSUdBrJy9Un0EYoBowng", "songname": "20 Min", "addedbyuserid": "vishukethees", "username": "vishukethees", "score": 2, "userScore": "-" }, { "songid": "01ibNvCrbTdwOcqIcroORv", "songname": "2 The Face", "addedbyuserid": "vishukethees", "username": "vishukethees", "score": 1, "userScore": "-" }, { "songid": "6XkuklKiHYVTlVvWlTgQYP", "songname": "Erase Me - Main", "addedbyuserid": "vishukethees", "username": "vishukethees", "score": 0, "userScore": "-" }, { "songid": "3AHqaOkEFKZ6zEHdiplIv7", "songname": "Tokyo Drifting (with Denzel Curry)", "addedbyuserid": "danishmalik01", "username": "danishmalik01", "score": 10, "userScore": "-" }, { "songid": "2ej1A2Ze6P2EOW7KfIosZR", "songname": "Feather (feat. Cise Starr & Akin from CYNE)", "addedbyuserid": "danishmalik01", "username": "danishmalik01", "score": 0, "userScore": "-" }, { "songid": "6XyxCBp6x3jvtxXvMN5sAA", "songname": "1539 N. Calvert", "addedbyuserid": "danishmalik01", "username": "danishmalik01", "score": 0, "userScore": "-" }, { "songid": "2jfCy43LsFbCQoB6HyetlY", "songname": "Let Me Love You", "addedbyuserid": "ghifax", "username": "ghifax", "score": 0, "userScore": "-" }, { "songid": "1ZLrDPgR7mvuTco3rQK8Pk", "songname": "Way Back Home (feat. Conor Maynard) - Sam Feldt Edit", "addedbyuserid": "ghifax", "username": "ghifax", "score": 6, "userScore": "-" }, { "songid": "0qc4QlcCxVTGyShurEv1UU", "songname": "Post Malone (feat. RANI)", "addedbyuserid": "ghifax", "username": "ghifax", "score": 0, "userScore": "-" }, { "songid": "7FjZU7XFs7P9jHI9Z0yRhK", "songname": "So Close", "addedbyuserid": "ghifax", "username": "ghifax", "score": 0, "userScore": "-" }, { "songid": "1fsarPmsdYzQuEtgeqLusc", "songname": "Fading Away", "addedbyuserid": "tharshank85", "username": "tharshank85", "score": 0, "userScore": "-" }, { "songid": "5mJeFqtQiPvYzbeFIBiJ9S", "songname": "asteria", "addedbyuserid": "tharshank85", "username": "tharshank85", "score": 0, "userScore": "-" }, { "songid": "6JzgPzivpGAf1Nu5nKHahR", "songname": "Eyes Shut", "addedbyuserid": "tharshank85", "username": "tharshank85", "score": 0, "userScore": "-" }, { "songid": "3Kh5dwQbOfGgCKuU56wdj6", "songname": "Plant Sugar", "addedbyuserid": "tharshank85", "username": "tharshank85", "score": 0, "userScore": "-" }, { "songid": "4QOfUrTWpIlmziECELlCYN", "songname": "Dancing Under Red Skies", "addedbyuserid": "tharshank85", "username": "tharshank85", "score": 0, "userScore": "-" }, { "songid": "3pCDoblIpHzhMowUm9Icfy", "songname": "People", "addedbyuserid": "ghifax", "username": "ghifax", "score": 9, "userScore": "-" }, { "songid": "1UvXZz4bFzreMkZxNgJPDL", "songname": "Satisfied", "addedbyuserid": "johnkxr", "username": "johnkxr", "score": 0, "userScore": "-" }, { "songid": "4PvbbMYL4fkToni5BLaYRb", "songname": "Softly", "addedbyuserid": "johnkxr", "username": "johnkxr", "score": 0, "userScore": "-" }, { "songid": "5lFDtgWsjRJu8fPOAyJIAK", "songname": "Back To Back", "addedbyuserid": "johnkxr", "username": "johnkxr", "score": 0, "userScore": "-" }, { "songid": "7eFgcHYLppNnEQURFzalIO", "songname": "Car Keys", "addedbyuserid": "zvi3kfe6q8o0mzwvj0v9bgjig", "username": "Kieran.Tam", "score": 0, "userScore": "-" }, { "songid": "2AoCWJKiGjLGB5NBOqkv78", "songname": "Somebody Like You", "addedbyuserid": "zvi3kfe6q8o0mzwvj0v9bgjig", "username": "Kieran.Tam", "score": 0, "userScore": "-" }, { "songid": "5SN8Y8Q430cJL4kqboNYlf", "songname": "This City - Frank Walker Remix", "addedbyuserid": "zvi3kfe6q8o0mzwvj0v9bgjig", "username": "Kieran.Tam", "score": 8, "userScore": "-" }, { "songid": "2hnfwBQXNCQSStIOl39CFV", "songname": "Verliezen Met Jullie", "addedbyuserid": "zvi3kfe6q8o0mzwvj0v9bgjig", "username": "Kieran.Tam", "score": 0, "userScore": "-" }, { "songid": "1yIsDdY8ETskEbEjCtafaa", "songname": "all is not lost", "addedbyuserid": "zvi3kfe6q8o0mzwvj0v9bgjig", "username": "Kieran.Tam", "score": 0, "userScore": "-" }, { "songid": "0HohtPHt6Fl6mVtir1z4wr", "songname": "Long Ago", "addedbyuserid": "21l7ckkzm3n724zgz6lbosx4a", "username": "Akash Gupta", "score": 0, "userScore": "-" }, { "songid": "0cPt48GfZPQDi9XDawLWVt", "songname": "Away", "addedbyuserid": "21l7ckkzm3n724zgz6lbosx4a", "username": "Akash Gupta", "score": 0, "userScore": "-" }], "userScores": [{ "userspotifyid": "21l7ckkzm3n724zgz6lbosx4a", "username": "Akash Gupta", "confirmedvote": false, "score": 0 }, { "userspotifyid": "ghifax", "username": "ghifax", "confirmedvote": false, "score": 15 }, { "userspotifyid": "danishmalik01", "username": "danishmalik01", "confirmedvote": false, "score": 22 }, { "userspotifyid": "tharshank85", "username": "tharshank85", "confirmedvote": false, "score": 0 }, { "userspotifyid": "vishukethees", "username": "vishukethees", "confirmedvote": false, "score": 10 }, { "userspotifyid": "johnkxr", "username": "johnkxr", "confirmedvote": false, "score": 0 }, { "userspotifyid": "zvi3kfe6q8o0mzwvj0v9bgjig", "username": "Kieran.Tam", "confirmedvote": false, "score": 8 }]
}

//const testData = require('./utils/testData.js');

// const parseurl = require('parseurl');
// const path = require('path');
// const expressValidator = require('express-validator');

// NOTE: Need to SET SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET before running
// NOTE: Need to setup: SET DATABASE_URL=postgres://$(whoami)
// OR SET URL using: SET DATABASE_URL=$(heroku config:get DATABASE_URL -a your-app)


// Initialise a DB client
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function getDates(weeksAgoNum) {
  weeksAgoNum = weeksAgoNum ? weeksAgoNum : 0;
  console.log(weeksAgoNum);
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM session_start');
    client.release();
    const dates = result.rows.sort((a, b) => b.starttimestamp - a.starttimestamp); // Sort descending order
    console.log(dates);

    if (weeksAgoNum === dates.length) {
      console.log("ERROR: too many weeks ago");
      return null;
    }

    const start = new Date(dates[weeksAgoNum].starttimestamp).toISOString();
    return {
      start: start,
      end: weeksAgoNum // Check is weeksAgoNum = 0
        ? new Date(dates[weeksAgoNum - 1].starttimestamp).toISOString()
        : new Date(new Date().setDate(new Date(start).getDate() + 7)).toISOString(), // Default 1 wk after start date
    }
  } catch (err) {
    console.error(err);
    // Assume using localhost
    console.log("Returning default date (start to today)");
    return {
      start: '2020-04-07 00:00:00',
      end: new Date().toISOString(),
    }
  }
}

const app = express();
// const startTimestamp = '2020-04-13T17:25:00.000Z' // UCT
const redirect_uri = process.env.REDIRECT_URI
const uri = process.env.FRONTEND_URI

app.get('/', (req, res) => {
  res.json('You are in here!');
});

app.get('/login', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email', // + 'playlist-modify-private'
      redirect_uri
    }))
})

app.get('/callback', function (req, res) {
  const code = req.query.code || null

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    const access_token = body.access_token;
    // const refresh_token = body.refresh_token;

    // Get and return user details
    request.get(
      {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      },
      async (error, response, body) => {
        const userSpotifyID = body.id;
        const username = body.display_name;
        console.log("\nUSERID: " + userSpotifyID + "\tUSERNAME: " + username);

        // Add user to DB
        if (userSpotifyID) { // Check if userid found
          try {
            console.log("Checking if user is in DB");
            const client = await pool.connect();
            // Search for spotifyID in table
            const result = await client.query(`SELECT COUNT(1) FROM users WHERE userspotifyid='${userSpotifyID}'`);
            // Add person to table if necessary
            if (!parseInt(result.rows[0].count)) { await client.query(`INSERT INTO users VALUES ('${userSpotifyID}', '${username}')`); }
            client.release();

            res.redirect(uri + '?access_token=' + access_token + '&user_id=' + userSpotifyID + '&username=' + username);
            console.log("wtaf"); // sometimes exectued because async?
          } catch (err) {
            console.log("ERROR found in accessing DB");
            console.error(err);
            // res.send("ERROR! " + err); // not working? maybe add this as json?
            //const uri = process.env.FRONTEND_URI || 'http://localhost:3000'
            res.redirect(uri + '?access_token=' + access_token + '&user_id=' + userSpotifyID + '&username=' + username);
          }
        } else {
          console.log("ERROR spotify id not found. probs cos invalid access token?");
          res.redirect(uri + '?access_token=' + access_token);
        }
      }
    )
  })
})

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
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
    const results = { 'results': (result) ? result.rows : null };
    console.log(results);
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

// Database to retreive songs and update db
app.get('/db/songs', async (req, res) => {

  // Get dates
  const weeksAgo = req.query.weeksAgo;
  const startEndDates = await getDates(weeksAgo);
  // console.log("DATES")
  // console.log(startEndDates);

  // Get access token to get playlist details
  const accessToken = req.query.access_token;
  if (accessToken) {
    // Get collaborative playlist data
    request.get({
      url: 'https://api.spotify.com/v1/playlists/7JJzP95ARTN2A08g7xahXD',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    },
      async (error, response, body) => {
        // Only get songs after a certain date
        // console.log(body);
        // May need error handling if error received with getting access token: if body.error...
        const songs = body.tracks.items.reduce((songsList, item) => {
          return item.added_at > startEndDates.start
            ? songsList.concat({
              id: item.track.id,
              name: item.track.name,
              timestamp: item.added_at,
              user: item.added_by.id,
              duration: Math.round(item.track.duration_ms / 1000),
            })
            : songsList;
        }, []);

        if (songs) {
          try {
            const client = await pool.connect()
            // Add songs to database
            songs.forEach(async (song) => {
              song.id && // Ensure that it exists before querying db
                await client.query(`INSERT INTO songs VALUES ('${song.id}','${song.name}','${song.timestamp}','${song.user}','${song.duration}')`);
            })
            // Get songs for debugging
            /*
            const result = await client.query(`SELECT * FROM songs WHERE songadded BETWEEN '${startEndDates.start}' AND '${startEndDates.end}'`);
            client.release();
            const results = { 'results': (result) ? result.rows : null };
            res.json(results);
            */
            res.sendStatus(200);
          } catch (err) {
            console.error(err);
            console.log(songs);
            res.send("ERROR: somgething went wrong updating the songs:\n" + err);
          }
        }

      }
    );
  } else {
    res.redirect('/#' +
      querystring.stringify({
        error: 'invalid_token'
      }));
  }



})

// Retrieve songs
app.get('/db/songs/delete', (req, res) => {

  // Get data on top 10 songs in /api/result
  let songResults;
  try {
    request.get(
      {
        url: 'https://shared-playlist-backend.herokuapp.com/api/result',
        json: true
      },
      (error, response, body) => {
        if (!error) {
          console.log("Using heroku server date");
          songResults = body;
        }

        // Remove songs that are not in the top 10 from the Top Songs list
        const songRecord = songResults["songScores"];

        // Create sorted list of score, id
        const songScores = Object
          .keys(songRecord).map(key => [songRecord[key]["score"], songRecord[key]["songid"]])
          .sort((a, b) => a[0] - b[0]);

        // Slice songuris and create a list of songUris
        // This format: { "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh" }
        const worseSongs = songScores
          .slice(0, songScores.length - 10)
          .map(value =>
            ({ "uri": "spotify:track:" + value[1] })
          );

        // Construct object to return to spotify
        const trackUris = { "tracks": worseSongs };
        res.json(trackUris);
      });
  } catch (err) {
    console.error(err);
  }
})

app.get('/test', (req, res) => {
  // Get du hast song
  // Get access token to get playlist details
  const accessToken = req.query.access_token;
  if (accessToken) {
    // Get collabroative playlist data
    request({
      url: 'https://api.spotify.com/v1/playlists/0vdP5KBMbb08iGLktRXjIn',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    },
      (error, response, body) => {
        // console.log(body);
        const songUri = body.tracks.items.reduce((songsList, item) => {
          return item.added_at > '2020-04-13T17:25:00.000Z' // arbitrary date
            ? songsList.concat({
              "uri": item.track.uri,
            })
            : songsList;
        }, []);
        const trackUris = { "tracks": songUri };
        tracks = JSON.stringify(trackUris)
        console.log(tracks)

        // Delete tracks

        const options = {
          url: 'https://api.spotify.com/v1/playlists/0vdP5KBMbb08iGLktRXjIn/tracks',
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
          },
          json: true,
          "tracks": [{ "uri": "spotify:track:2qQg4qcqJmAalzRwhgf5mt" }],
        }
        console.log(options)
        request(options, (error, response, body) => {
          console.log(body);
          // console.log(response);
          console.error(error);
          res.status(200).send("Maybe done");
        }
        );

      }
    )
  }
});

// UTIL functions

// API FUNCTIONS

// USE functions to attach to headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URI);
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));

// GET data from API (using spotify implementation)
app.get('/api/playlist', async (req, res, next) => {

  console.log('Getting data from api/playlist');

  // Get dates
  // const weeksAgo = req.query.weeksAgo;
  const startEndDates = await getDates(0); // Can only get week 0, so that they can't modify prev scores

  // Get playlist meta data using spotify API, but song data from DB
  const accessToken = req.query.access_token;
  if (accessToken) {
    // Get collabroative playlist data
    request.get({
      url: 'https://api.spotify.com/v1/playlists/7JJzP95ARTN2A08g7xahXD',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    },
      async (error, response, body) => {

        // NOTE: may need to query based on timestamp (LATER)
        // Get playlist details from DB or API
        try {
          const client = await pool.connect()
          const userid = req.query.user_id; // Get userid from url

          // Query all songs with userid in song_user_score after startTimestamp
          let userSongIds = await client.query(`SELECT songid FROM song_user_score WHERE userid = '${userid}' AND originaltimestamp BETWEEN '${startEndDates.start}' AND '${startEndDates.end}'`);
          userSongIds = userSongIds.rows.map(record => record.songid);

          // Query all songid in songs after startTimestamp
          const allSongIds = await client.query(`SELECT songid FROM songs WHERE songadded BETWEEN '${startEndDates.start}' AND '${startEndDates.end}'`);

          // Add missing songs in song_user_score table
          allSongIds.rows.forEach(async (song, index) => {
            if (!userSongIds.includes(song.songid)) {
              // NOTE: set default value of song score to 10, so that it doesn't affect rank
              await client.query(`INSERT INTO song_user_score VALUES ('${song.songid}', '${userid}', '10', '${new Date().toISOString()}', '${new Date().toISOString()}')`);
            }
          })

          // Use join query to get songid, songname, duration, score
          const userSongsScores = await client.query(
            `SELECT songs.songid, songs.songname, songs.duration, song_user_score.score FROM songs INNER JOIN song_user_score ON songs.songid=song_user_score.songid AND song_user_score.userid='${userid}' WHERE songs.songadded BETWEEN '${startEndDates.start}' AND '${startEndDates.end}'`
          );

          // Add songs to playlist as json
          const playlist = {
            name: body.name,
            imgUrl: body.images[0].url,
            songs: userSongsScores.rows.map(row => {
              //console.log(row.duration)
              return {
                id: row.songid,
                name: row.songname,
                duration: row.duration, // dunno what format
                score: row.score
              }
            })
          }
          // console.log("PLAYLIST after inner join");
          // console.log(playlist);

          res.json(playlist);
          client.release();
        } catch (err) {
          console.error(err);

          // Return playlist using spotify API instead of DB

          //console.log(body.tracks.items);
          const playlist = {
            name: body.name,
            imgUrl: body.images[0].url,
            songs: body.tracks.items.reduce((songsList, item) => {
              if (item.added_at > startEndDates.start && item.added_at < startEndDates.end) {
                return songsList.concat({
                  id: item.track.id,
                  name: item.track.name,
                  duration: item.track.duration_ms,
                  score: 10, // Default so that it doesn't affect rankings
                });
              } else {
                return songsList;
              }
            }, [])
          };

          res.json(playlist);
        }
      })
  } else {
    res.redirect('/#' +
      querystring.stringify({
        error: 'invalid_token and invalid user_id'
      }));
  }

});

// POST order of playlist
app.post('/api/playlist', async (req, res, next) => {
  console.log("POST playlist method");
  // Update table
  const userid = req.body.id;
  try {
    const client = await pool.connect()

    // Assume score already added (through get method when getting playlist)
    // for now search for all songs scored after 10/4 by user
    // UPDATE records
    await req.body.songs.forEach((item, index) => {
      const songid = item.id;
      //const score = item.score;
      client.query(
        `UPDATE song_user_score SET score='${index}', scoretimestamp='${new Date().toISOString()}' WHERE songid='${songid}' AND userid='${userid}'`
      );
    })
    client.release();
    res.sendStatus(200)
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
  // res.status(500).send(req.body);
});

// GET order of songs based on top 10
app.get('/api/result', async (req, res, next) => {
  console.log("\nGETTING topsongs\n");

  // Get dates
  const weeksAgo = req.query.weeksAgo;
  const startEndDates = await getDates(weeksAgo);

  const maxSongScore = 10;
  const userid = req.query.user_id;
  try {
    const client = await pool.connect();
    const songRecords = await client.query(`SELECT songs.songid, songs.songname, songs.addedbyuserid, users.username FROM songs INNER JOIN users ON songs.addedbyuserid=users.userspotifyid WHERE songadded BETWEEN '${startEndDates.start}' AND '${startEndDates.end}'`);
    const userScoreRecords = await client.query(`SELECT songid, userid, score FROM song_user_score WHERE originaltimestamp BETWEEN '${startEndDates.start}' AND '${startEndDates.end}'`);
    const users = await client.query(`SELECT * FROM users`);
    client.release();

    // console.log(songRecords);
    // console.log(userScoreRecords);
    // console.log(users);

    // ALl userids and names
    // Create an array of songs and score

    let songScores = []
    songRecords.rows.forEach((songRecord) => {
      let songScore = 0;
      // let userRating = users.rows.map ( userRecord => {
      //   return {
      //     id: userRecord.userspotifyid,
      //     name: userRecord.username,
      //     score: 0
      // }});
      let userRating = '-';
      userScoreRecords.rows.forEach(scoreRecord => {
        if (scoreRecord.songid === songRecord.songid && scoreRecord.score < maxSongScore && songRecord.addedbyuserid !== scoreRecord.userid) {
          songScore += maxSongScore - scoreRecord.score;
          // Find userid and push score
          if (scoreRecord.userid === userid) { userRating = maxSongScore - scoreRecord.score }
        }
      });
      // console.log(songScore);
      songScores.push({ ...songRecord, score: songScore, userScore: userRating });
    })

    // Create an array of users and scores
    let userScores = [];
    users.rows.forEach(user => {
      if (!songScores.map(item => item.addedbyuserid).includes(user.userspotifyid)) { return null };
      let userScore = 0;
      songScores.forEach(songScoreItem => {
        userScore += songScoreItem.addedbyuserid === user.userspotifyid ? songScoreItem.score : 0;
      })
      userScores.push({ ...user, score: userScore });
    });

    res.json({ songScores: songScores, userScores: userScores }); // REMOVED: `, users: users.rows`
    // res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
})

app.get('/callback-google', async (req, res, next) => {
  console.log("\nGETTING topsongs\n");

  // Get dates
  const weeksAgo = req.query.weeksAgo;
  const startEndDates = await getDates(weeksAgo);
  console.log("START END DATES:\n");
  console.log(startEndDates);

  const maxSongScore = 10;
  try {
    const client = await pool.connect();
    const songRecords = await client.query(`SELECT songs.songid, songs.songname, songs.addedbyuserid, users.username FROM songs INNER JOIN users ON songs.addedbyuserid=users.userspotifyid WHERE songadded BETWEEN '${startEndDates.start}' AND '${startEndDates.end}'`);
    const userScoreRecords = await client.query(`SELECT songid, userid, score FROM song_user_score WHERE score < ${maxSongScore} AND originaltimestamp BETWEEN '${startEndDates.start}' AND '${startEndDates.end}'`);
    const users = await client.query(`SELECT * FROM users`);
    client.release();

    // Create an array of songs and score
    let csv = [];
    let firstRow = ['songs','addedBy',];

    // Map all users to indexes in csv
    // And fill in first row of csv
    const usersDict = users.rows.reduce((prev, user, index) => {
      prev[user.userspotifyid] = {
        username: user.username,
        index: index + 2
      };
      firstRow.push(user.username);
      return prev;
    }, {});

    csv.push(firstRow);

    console.log("\nUSERS DICT\n");
    console.log(usersDict);

    const emptyUserScore = Object.keys(usersDict).map(() => 0);
    console.log("\nEMPTY USER SCORE\n");
    console.log(emptyUserScore);

    const songsDict = songRecords.rows.reduce((prev, song, index) => {
      csv.push([song.songname, usersDict[song.addedbyuserid].username].concat(
        emptyUserScore
      ));
      prev[song.songid] = {
        songname: song.songname,
        addedBy: song.addedbyuserid,
        index: index + 1
      }
      return prev;
    }, {});

    console.log("\n SONGS DICT \n");
    console.log(songsDict);

    console.log("\n SONG FILLED CSV \n");
    console.log(csv);

    // Create csv like so:
    /*
    songname, addedBy, username_i ...
    */

    // console.log(userScoreRecords);

    userScoreRecords.rows.forEach(scoreRecord => {
      console.log(scoreRecord);
      if (scoreRecord.songid && scoreRecord.userid && scoreRecord.score < maxSongScore && songsDict[scoreRecord.songid].addedBy !== scoreRecord.userid) {
        // Add entry to csv
        const songIndex = songsDict[scoreRecord.songid].index;
        console.log("Song index: " + songIndex);
        const userIndex = usersDict[scoreRecord.userid].index;
        console.log("user index: " + userIndex);
        csv[songIndex][userIndex] = maxSongScore - scoreRecord.score;
      }
    });

    console.log("\n SONGS SCORE FILLED \n");
    console.log(csv);

    // convert csv array to actual csv


    res.json(csv);
    // res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
})

app.get('/api/playlist/delete', (req, res) => {
  // Get dongs to delete from /db/songs/delete

})

let port = process.env.PORT
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)