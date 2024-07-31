const express = require('express');
// const fetch = require('node-fetch');
const redis = require('redis');

const app = express();

const PORT = process.env.PORT || 5000;
const redis_PORT = process.env.port || 6379;

const client = redis.createClient(redis_PORT);

function setResponse(username, repos){
    return `<h1> ${username} has ${repos} github repos </h1>`
};

async function getRepos(req, res, next) {
    try {
        console.log('Fetching Data...');

        const { username } = req.params;

        const client = redis.createClient(redis_PORT);

        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        const repos = data.public_repos;

        client.setEx(username, 3600, repos);

        res.send(setResponse(username, repos));

        client.quit();
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}
 function cache(req, res, next){
    const {username} = req.params;

    client.get(username, (err, data)=>{
       if(err) throw err;
       if(data !== null){
        res.send(setResponse(username, repos));
       }else{
        next();
       }
    })
 }


app.get('/repo/:username',cache,  getRepos);

app.listen(PORT, ()=>{
    console.log(`listening to the port ${PORT}`)
});