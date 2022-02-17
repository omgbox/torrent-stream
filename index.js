const express = require('express');
// const torrentStream = require('torrent-stream');
const prepStream = require('./stream');
// const fastify = require('fastify')();


const app = express();

app.get('/torrentStream', prepStream);

app.get('/', (req, res) => {
    res.sendStatus(200);
})

const port = process.env.PORT || 19964;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// fastify.get('/torrentStream', prepStream);

// const start = async () => {
//     try {
//         await fastify.listen(port);
//         console.log(`server listening on ${fastify.server.address().port}`);
//     } catch (err) {
//         console.error(err);
//     }
// };
// start();