const http = require('http');
const https = require('https');
const fs = require("fs");
const { exec } = require("child_process");

let stickersCounter = 0;

const print = (fileName) => {
    exec(`mspaint /p "C:\\Users\\aless\\Documents\\stickers-printer\\sticker-printer-server\\stickers\\${fileName}"`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`printed ${fileName}`);
    });
}

var servreOptions = {
    key: fs.readFileSync('https/server.key'),
    cert: fs.readFileSync('https/server.cert')
  };

const server = https.createServer(servreOptions, (req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST'
    };
    if (req.method == 'POST') {
        let reqData = "";
        req.on('data', data  => {
            reqData+=data;
        })
        req.on('end', data => {
            const parsedData = JSON.parse(reqData);
            const fileName = `sticker_${stickersCounter}.png`;
            fs.writeFileSync(`stickers/${fileName}`, parsedData.image , 'base64', (error) => {
                console.log(error);
            } )
            stickersCounter++;
            print(fileName)
            res.writeHead(200, headers)
            res.end('post received');
        })
    }
    else{
        res.writeHead(200, headers)
    }

})

const port = 3000
const host = '192.168.1.4';
server.listen(port, host);
console.log(`Listening at https://${host}:${port}`);






