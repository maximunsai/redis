const express = require('express');

const fetch = require('node-fetch');
const axios = require('axios').default;

const client = require('./client');

const app =express();

const PORT = 8000;


app.get('/', async (req, res)=>{

    const casheValue = await client.get('todos');

    if(cacheValue) return res.json(json.parse(cacheValue));

    const {data} = await axios.get(`https://jsonplaceholder.typicode.com/todos`);

    await client.set(("todos", json.stringify(data)));

    await client.expire('todos', 30)

   return  res.send(data)
})


app.listen(PORT, ()=>{
    console.log(`server listening to the port ${PORT}`)
});