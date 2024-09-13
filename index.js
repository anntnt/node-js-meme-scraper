import fs from 'node:fs';
import process from 'node:process';
import axios from 'axios';
import * as cheerio from 'cheerio';

// import * as client from 'node:https';
// import * as stream from 'node:stream';
// import { promisify } from 'node:util';

// URL of the page we want to scrape
const URL = 'https://memegen-link-examples-upleveled.netlify.app';
const DIR = './memes';

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}
await scrapeData(URL);

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

// Async function which scrapes the data
async function scrapeData(url) {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist id
    const listItems = $('#images div a');
    // Stores data for the first 10 image sources
    const imageLinks = [];
    // Use for loop through the a we selected
    for (let i = 0; i < 10; i++) {
      // let src = '';
      const imageLink = { src: '' };
      imageLink.src = $(listItems[i]).children('img').attr('src');
      // remove the substring '?width=300' from image source
      // imageLink.src = src.slice(0, src.indexOf('?'));
      // Populate imageLinks array with image source
      imageLinks.push(imageLink);
      // console.log(imageLink);
    }
    // return imageLinks;
    // const imageLinks = await scrapeData(URL);
    // imageLinks.forEach((el, index) => {
    for (const [index, el] of imageLinks.entries()) {
      let filePath;
      // create file path
      if (index < 9) filePath = `${DIR}\/0${index + 1}.jpg`;
      else filePath = `${DIR}\/${index + 1}.jpg`;
      // console.log(el.src + ' : ' + filePath);
      // download image and save to the file path
      await downloadImage(el.src, filePath);
      console.log('Downloaded ' + el.src + ' to ' + filePath);
    }
  } catch (err) {
    console.error(err);
  }
}

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return await new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
  });
}

// Invoke the function scrapeData() to get list of the first 10 images from the website
/* const imageSrcList = await scrapeData(URL);
// imageSrcList.forEach((el, index) => {
for (const [index, el] of imageSrcList.entries()) {
  let filePath;
  // create file path
  if (index < 9) filePath = `${DIR}\\0${index + 1}.jpg`;
  else filePath = `${DIR}\\${index + 1}.jpg`;
  // console.log(el.src + ' : ' + filePath);
  download image and save to the file path
  await downloadImage(el.src, filePath)
    .then(console.log('Downloaded.'))
    .catch(console.error);
}
// });
// console.log(imageSrcList);*/
/* async function downloadImage(url, filepath) {
  return await new Promise((resolve, reject) => {
    client.get(url, (res) => {
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
}*/

/* async function downloadImage(url, filepath) {
  const finishedDownload = promisify(stream.finished);
  const writer = fs.createWriteStream(filepath);

  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
  });

  response.data.pipe(writer);
  await finishedDownload(writer);
}*/

/* ******************** */
/* client
  .get(URL, function (res) {
    console.log(res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function (data) {
      const $ = cheerio.load(data);
      console.log(typeof $.html());
    });
  })
  .on('error', function (err) {
    console.log(err);
  });*/

/* ****************** */
