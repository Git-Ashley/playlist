const mongoose = require('mongoose');
const Card = require('../models/card-course-model/card.js');
const fs = require('fs');
const csv = require('csv-parser');


let dupes = 0;
let newInserts = 0;

/*
  TODO
  The script works as is, but with some issues with digitalIndex including spaces in some entries.
  N1 hasn't been included yet because there is no furigana, and N1 would
  bloat the DB, and we may as well wait until (if) furigana gets added, or until
  I eventually get round to N1 in a long time.
  Tbh I might just create a separate N1 course.
*/

const SECTION = 'Tag';
const VALUE = 'Vocabulary-Japan';
const DEF = 'Vocab-English';
const EXAMPLE = 'Sent-Japan';
const EXAMPLE_ANS = 'Sent-English';
const INDEX = 'Sort Index';
const GENER_SENT = 'Gener Sent';
const TAG = 'Entry Type';
const N = '1';

const results = [];
const uploadVocab = (courseId) => {
  const mongoUrl = 'mongodb://localhost:27017/docker-node-mongo';
  mongoose
      .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('MongoDB Connected'))
      .catch(console.log);

  fs.createReadStream(`./JLPT${N}Tango.csv`)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {

      const mappedResults = [];
      const uploadHashToMappedResult = new Map();

      results.forEach(data => {
        const digitalIndex = data[INDEX].split('_')[3];
        let tag = data[TAG];

        if (digitalIndex.length !== 4 && digitalIndex.length !== 8) {
          //throw `Unexpected digitalIndex: ${digitalIndex} has length ${digitalIndex.length}`;
        }

        const value = data[VALUE];
        const fourDigitIndex = digitalIndex.split('-')[0];
        const uploadHash = `${fourDigitIndex}:${value}`;

        if (uploadHashToMappedResult.has(uploadHash)) {
          const mappedResult = uploadHashToMappedResult.get(uploadHash);

          if (!mappedResult.definition[0] === data[DEF]) {
            mappedResult.definition.push(data[DEF]);
          }

          if (data[EXAMPLE]) {
            if (mappedResult.examples) {
              mappedResult.examples.push({
                example: data[EXAMPLE],
                answer: data[EXAMPLE_ANS]
              });
            } else {
              mappedResult.examples = [{
                example: data[EXAMPLE],
                answer: data[EXAMPLE_ANS]
              }];
            }
          }

          dupes++;
          return;
        }

        const audioFile = `n${N}/${fourDigitIndex}.mp3`;
        const mappedResult = {
          primary_index: `5_${digitalIndex}`,
          value,
          definition: [data[DEF]],
          attributes: [{
            key: 'book_location',
            value: data[SECTION],
          }, {
            key: 'audio',
            value_type: 'audio',
            value: audioFile,
          }],
          course_tags: [`N${N}`, tag],
          course_id: mongoose.Types.ObjectId('600203a5a39a74def6527f7c')
        };

        if (data[EXAMPLE]) {
          mappedResult.examples = [{
            example: data[EXAMPLE],
            answer: data[EXAMPLE_ANS]
          }];
        }

        if (data[GENER_SENT]) {
          mappedResult.attributes.push({
            key: 'gener_sent',
            value: data[GENER_SENT]
          });
        }

        newInserts++;
        mappedResults.push(mappedResult);
        uploadHashToMappedResult.set(uploadHash, mappedResult);
      });

      console.log('mappedResults.length:', mappedResults.length);
      console.log('newInsert: ', newInserts);
      console.log('dupes: ', dupes);

      mappedResults.forEach((vocabData, index) => {
        Card.create(vocabData)
          .then(newCard => {
            //console.log('newCard:', newCard);
          }).catch(err => console.log('ERROR: ', err));
      })
    });
};

uploadVocab();
