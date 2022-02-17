const pump = require('pump');
const WebTorrent = require('webtorrent')

const magnetEngineMap = {};

class StreamClass {
    constructor(magnet, req = undefined, res = undefined) {
        this.client = new WebTorrent()
        this.magnet = magnet;
        this.tracks = [[]];
        this.client.add(magnet, torrent => {
            console.log(torrent.infoHash);
            this.tracks = torrent.files.filter((x) => x.path.includes('.mp3') || x.path.includes('.mp4')).sort(a, b => a.length - b.length);
            this.tracks.forEach((itm) => {
                console.log(itm.path, itm.length);
            });
            this.streamReady(req, res);
        });
    }

    streamReady = (req, res) => {
        if (this.tracks[0].length) {
            console.log(this.tracks[0].length, req.headers.range);
            this.sendStream(req, res);
        }
        else {
            this.client.add(magnet, torrent => {
                console.log(torrent.infoHash);
                this.tracks = torrent.files.filter((x) => x.path.includes('.mp3') || x.path.includes('.mp4'));
                this.sendStream(req, res);
            });
        }
    }

    sendStream = (req, res) => {
        if (req.method === 'HEAD') {
            return res.end()
        }
        const total = this.tracks[0].length;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const partialstart = parts[0];
            const partialend = parts[1];
            const start = parseInt(partialstart, 10);
            const end = partialend ? parseInt(partialend, 10) : total - 1;
            const chunksize = end - start + 1;
            res.statusCode = 206
            res.setHeader('Content-Length', end - start + 1)
            res.setHeader(
                'Content-Range',
                'bytes ' + start + '-' + end + '/' + total
            );
            res.setHeader(
                "Content-Type", "video/mp4"
            );
            const stream = this.tracks[0].createReadStream({ start, end })
            return pump(stream, res);
        } else {
            res.setHeader(
                "Content-Type", "video/mp4"
            );
            const stream = this.tracks[0].createReadStream();
            return pump(stream, res);
        }
    }
};

const prepareStream = async (req, res) => {
    try {
        const { magnet } = req.query;
        if (magnet) {
            if (!magnetEngineMap[magnet]) {
                magnetEngineMap[magnet] = new StreamClass(magnet, req, res);
                return
            }
            magnetEngineMap[magnet].streamReady(req, res);
            return;
        }
        console.log('missing magnet param');
        return res.sendStatus(404);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

module.exports = prepareStream;