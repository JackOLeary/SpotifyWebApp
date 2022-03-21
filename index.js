// This file is used for authentication into a Spotify Account, retrieving the access token and refresh token and returning to the react app

//loads environment variables from .env file into process.env
require('dotenv').config()

// axios instance used for rout handling
const axios = require('axios');

// express instance used for route handling
const express = require('express');
const app = express();

// port on localhost that the website will be on
const port = 8888;

// required for spotify API
const CLIENT_ID= process.env.CLIENT_ID;
const CLIENT_SECRET= process.env.CLIENT_SECRET;
const REDIRECT_URI= process.env.REDIRECT_URI;

//node is serverside so this is logged in the terminal instead of the browser
// console.log(process.env.CLIENT_ID);

app.get('/', (req, res) => {
    const data = {
        name: 'jack',
        age: '24',
    }
    res.json(data);
});

/**
 * Generate a random string containing numbers and letters
 * @param {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = length => {
    let text = '';
    const possible = 'QWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) =>{
    // state is a random string each time, protects against attacks
    const state = generateRandomString(16);
    // cookie WHAT IS THIS FOR?????????????????????????????????????????????????????
    // res.cookie(stateKey, state);

    // permissions for our app to the user account
    const scope = [
        'user-read-private',
        'user-read-email',
        'user-top-read'
    ].join(' ');

    let params = new URLSearchParams([
        ['client_id', CLIENT_ID],
        ['response_type', 'code'],
        ['redirect_uri', REDIRECT_URI],
        ['state', state],
        ['scope', scope],
    ]);

    // redirect to authorization api link, this will redirect to REDIRECT_URI after the user logs in... which is /callback
    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
})

// Redirects here after logging in
app.get('/callback', (req, res) => {
    // retrieve's 'code' parameter from url
    const code = req.query.code || null;

    // Post request using axios, use Authorization code to get access token
    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams([
            ['grant_type', 'authorization_code'],
            ['code', code],
            ['redirect_uri', REDIRECT_URI]
        ]),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
    })
        // axios stores data returned in .data
        // Use access token to get user details
        .then(response => {
            if (response.status == 200) {
                // retrieve data from api response (api/token)
                const {access_token, refresh_token, expires_in} = response.data

                //redirect to react app
                let queryParams = new URLSearchParams([
                    ['access_token', access_token],
                    ['refresh_token', refresh_token],
                    ['expires_in', expires_in],
                ]);

                res.redirect(`http://localhost:3000/?${queryParams.toString()}`)
            } else {
                res.redirect(`/?${new URLSearchParams(['error', 'invalid_token']).toString()}`);
            }
        })
        .catch(error => {
            res.send(error);
        });
})

app.get('/refresh_token', (req,res) => {
    const {refresh_token} = req.query;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams([
            ['grant_type', 'refresh_token'],
            ['refresh_token', refresh_token],
        ]),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.send(error);
    });
})

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});