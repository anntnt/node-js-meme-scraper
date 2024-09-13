import fs from 'node:fs';
import process from 'node:process';
import axios from 'axios';
import * as cheerio from 'cheerio';

// URL of the page we want to scrape
const URL = 'https://memegen-link-examples-upleveled.netlify.app';
const DIR = './memes';

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}
// await scrapeData(URL);

const imageLinks = await scrapeData(URL);
imageLinks.forEach((el, index) => {
  // for (const [index, el] of imageLinks.entries()) {
  let filePath;
  // create file path
  if (index < 9) filePath = `${DIR}/0${index + 1}.jpg`;
  else filePath = `${DIR}/${index + 1}.jpg`;
  // download image and save to the file path
  downloadImage(el.src, filePath).catch(console.error);
  // console.log('Downloaded ' + el.src + ' to ' + filePath);
});

// see if the program works
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
    //console.log(listItems);
    // Stores data for the first 10 image sources
    const imageList = [];
    // Use for loop through the a we selected
    for (let i = 0; i < 10; i++) {
      const imageLink = { src: '' };
      imageLink.src = $(listItems[i]).children('img').attr('src');
      imageList.push(imageLink);
    }
    return imageList;
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
