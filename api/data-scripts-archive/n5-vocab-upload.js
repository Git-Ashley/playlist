const mongoose = require('mongoose');
const Card = require('../models/card-course-model/card.js');
const fs = require('fs');
const csv = require('csv-parser');

let dupes = 0;
let newInserts = 0;
let dbInserts = 0;

const results = [];
const uploadVocab = (courseId) => {
  const mongoUrl = 'mongodb://localhost:27017/docker-node-mongo';
  mongoose
      .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('MongoDB Connected'))
      .catch(console.log);

  fs.createReadStream('./JLPT5Tango.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {

      const mappedResults = [];
      const uploadHashToMappedResult = new Map();

      results.forEach(data => {
        const value = data['Vocab-Furigana'];
        const fourDigitSortInteger = data['4 Digit Sort'].split('-')[0];
        const uploadHash = `${fourDigitSortInteger}:${value}`;

        if (uploadHashToMappedResult.has(uploadHash)) {
          const mappedResult = uploadHashToMappedResult.get(uploadHash);

          if (!mappedResult.definition[0] === data['Vocab-English']) {
            mappedResult.definition.push(data['Vocab-English']);
          }

          if (data['Sent-Furigana']) {
            if (mappedResult.examples) {
              mappedResult.examples.push({
                example: data['Sent-Furigana'],
                answer: data['Sent-English']
              });
            } else {
              mappedResult.examples = [{
                example: data['Sent-Furigana'],
                answer: data['Sent-English']
              }];
            }
          }

          dupes++;
          return;
        }

        const audioFile = `n5/${fourDigitSortInteger}.mp3`;
        const mappedResult = {
          primary_index: `1_${data['4 Digit Sort']}`,
          value,
          definition: [data['Vocab-English']],
          attributes: [{
            key: 'book_location',
            value: `${data['Chapter']} ${data['Section']}`,
          }, {
            key: 'audio',
            value_type: 'audio',
            value: audioFile,
          }],
          course_tags: ['N5'],
          course_id: mongoose.Types.ObjectId('600203a5a39a74def6527f7c')
        };

        if (data['Sent-Furigana']) {
          mappedResult.examples = [{
            example: data['Sent-Furigana'],
            answer: data['Sent-English']
          }];
        }

        if (data['Gener Sent']) {
          mappedResult.attributes.push({
            key: 'gener_sent',
            value: data['Gener Sent']
          });
        }

        newInserts++;
        mappedResults.push(mappedResult);
        uploadHashToMappedResult.set(uploadHash, mappedResult);
      });

      console.log('mappedResults.length:', mappedResults.length);

      mappedResults.forEach((vocabData, index) => {
        Card.create(vocabData)
          .then(newCard => {
            //console.log('newCard:', newCard);
            ++dbInserts;
            if (index === mappedResults.length) {
              console.log('dbInserts: ', dbInserts);
              console.log('newInsert: ', newInserts);
              console.log('dupes: ', dupes);
            }
          }).catch(err => console.log('ERROR: ', err));
      })
    });
};

uploadVocab();
