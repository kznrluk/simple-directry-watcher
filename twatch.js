const fs = require('fs');
const Twitter = require('twitter');

const config = require('./config.json')
const DIR_NAME = config.dir;

// Setting up Twitter API keys.
const client = new Twitter({
    consumer_key : config.twitter.apiKey,
    consumer_secret : config.twitter.apiSecret,
    access_token_key: config.twitter.accessToken,
    access_token_secret: config.twitter.accessSecret
});

const isDirectryHasSomeFile = async (dirName) => {
    let result;
    try {
        result = await new Promise((resolve, reject) => {
            fs.readdir(dirName, (err, files) => {
                if(err) reject(err);
                resolve( files.length >= 1 ? true : false );
            })
        });
    } catch (err) {
        console.log(err);
    }
    return result;
}

const promises = [];
for(directory of DIR_NAME){
    promises.push(isDirectryHasSomeFile(directory));
}

const noFileDirectories = [];
Promise.all(promises)
    .then(results => {
        results.forEach((result, index) => {
            if(!result){
                noFileDirectories.push(DIR_NAME[index])
            }
        });
        const tweet = `@${config.twitter.user} [twatch.js : No file directory] ${noFileDirectories}`
        client.post('statuses/update', {status: tweet}, err => {
            if (err) throw err;
        });
    });