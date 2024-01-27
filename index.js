const express = require('express');
// const torrentStream = require('torrent-stream');
const prepStream = require('./stream');
// const fastify = require('fastify')();


const app = express();
// https://site.com/get?magnet=
app.get('/get', prepStream);

app.get('/', (req, res) => {
    res.sendStatus(200);
})

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// fastify.get('/torrentStrea', prepStream);

// const start = async () => {
//     try {
//         await fastify.listen(port);
//         console.log(`server listening on ${fastify.server.address().port}`);
//     } catch (err) {
//         console.error(err);
//     }
// };
// start();
