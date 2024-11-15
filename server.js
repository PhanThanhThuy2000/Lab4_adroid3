const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Khởi động server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

// Hiển thị trang upload file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/uploads.html');
});

// Cấu hình multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        let fileName = file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Route upload file
app.post('/uploadfile', upload.single('myfile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Vui lòng chọn file!');
        error.httpStatusCode = 400;
        return next(error);
    }
    let pathFileInServer = file.path;
    console.log(pathFileInServer);
    res.send(file);
});