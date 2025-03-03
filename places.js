const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const spreadsheetId = '1ElaHfyREBxmAOoLJhKTxkGYj6kzbujs-pvkJbhqoVWg';


/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents() {
    const auth = await authorize();
    const calendar = google.calendar({ version: 'v3', auth });
    const today = new Date();
    const oneWeekFromNow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString();
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        timeMax: oneWeekFromNow,
        orderBy: 'startTime',
        singleEvents: true
    });
    const events = res.data.items;
    // console.log(res.data.items.length)
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    // events.map((event, i) => {
    //   console.log(event)
    //   const start = event.start.dateTime || event.start.date;
    //   console.log(`${start} - ${event.summary}`);
    // });
    return events
}

async function syncResources() {
    const auth = await authorize();
    const calendar = google.calendar({ version: 'v3', auth });
    const today = new Date();
    const twoWeeksFromNow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).toISOString();

    const res = await calendar.events.list({
        calendarId: 'primary',
        // timeMin: today.toISOString(),
        // timeMax: twoWeeksFromNow,
        // singleEvents: true,
        syncToken: 'CNDEsKKNyoUDENDEsKKNyoUDGAUgiKfCqQIoiKfCqQI='
    });
    const events = res.data.items;
    console.log(res.data)
    events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
    });

}

// authorize().then(listEvents).catch(console.error);
module.exports = {
    listEvents
}