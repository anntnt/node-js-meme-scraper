import fs from 'node:fs';
import http from 'node:https';
import * as cheerio from 'cheerio';

const MEMES_URL = 'https://memegen-link-examples-upleveled.netlify.app';
let html_data;
const file_list = [];

http
  .get(MEMES_URL, function (res) {
    console.log(res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function (data) {
      console.log(data);
      //html_data = data;
    });
  })
  .on('error', function (err) {
    console.log(err);
  });
/*const $ = cheerio.load(html_data);
console.log(pretty($.html()));*/

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`),
        );
      }
    });
  });
}
/*downloadImage(
  'https://api.memegen.link/images/bad/your_meme_is_bad/and_you_should_feel_bad.jpg',
  'memes/01.jpg',
);*/
