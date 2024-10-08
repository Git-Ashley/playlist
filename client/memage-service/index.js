const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const uuid = require('uuid');

const PORT = 33404;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cookieParser());

app.put('/memage/', async (req, res) => {
  const imgData = req.body.data;
  const imgType = req.body.type;

  if (!['jpg', 'jpeg', 'png', 'webp'].includes(imgType)) {
    return res.status(400).json({ msg: 'Invalid file type' });
  }

  const data = imgData.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, 'base64');
  const fileName = `${uuid.v4()}.${imgType}`;

  fs.writeFile(`../public/static/images/kanji-course/${fileName}`, buf, result => {
    console.log('result:', result);
    res.json({ url: `/static/images/kanji-course/${fileName}` });
  });
});

app.post('/memage/delete/', async (req, res) => {
  const imgUrl = req.body.imgUrl;

  if (!imgUrl) {
    return res.status(400).json({ msg: 'image url not provided' });
  }

  const path = `../public${imgUrl}`;

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ msg: 'error while deleting file' });
    }

    return res.json({ msg: 'Successfully deleted' });
  })
});

app.listen(PORT, (err) => {
    if(err){
        console.error(err);
        process.exit(1);
    } else {
        console.log(`Listening on port: ${PORT} (http)`);
        if(process.env.NODE_ENV !== "production")
            console.log("Running in development mode");
        else
            console.log("Running in production mode");
    }
});