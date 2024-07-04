const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const allowedIPs = ['127.0.0.1', '::1']; // Adicione aqui os IPs permitidos

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '.txt');
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.fields([{ name: 'msg1' }, { name: 'msg2' }, { name: 'msg3' }]), (req, res) => {
    const { carousel, status } = req.body;
    const data = {
        carousel: carousel,
        status: status
    };

    fs.writeFileSync(path.join(__dirname, 'data', 'data.json'), JSON.stringify(data));

    res.json({
        msg1: fs.readFileSync(path.join(__dirname, 'data', 'msg1.txt'), 'utf8'),
        msg2: fs.readFileSync(path.join(__dirname, 'data', 'msg2.txt'), 'utf8'),
        msg3: fs.readFileSync(path.join(__dirname, 'data', 'msg3.txt'), 'utf8'),
        status: status
    });
});

app.get('/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'data.json'), 'utf8'));
    const msg1 = fs.readFileSync(path.join(__dirname, 'data', 'msg1.txt'), 'utf8');
    const msg2 = fs.readFileSync(path.join(__dirname, 'data', 'msg2.txt'), 'utf8');
    const msg3 = fs.readFileSync(path.join(__dirname, 'data', 'msg3.txt'), 'utf8');

    res.json({
        carousel: data.carousel,
        msg1: msg1,
        msg2: msg2,
        msg3: msg3,
        status: data.status
    });
});

app.get('/check-ip', (req, res) => {
    const clientIP = req.ip;
    const allowed = allowedIPs.includes(clientIP);
    res.json({ allowed: allowed });
});

app.listen(port, () => {
    console.log("Server is running at http://localhost:${port}");
});