import fs from 'node:fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

// URL of the page we want to scrape
const url = 'https://memegen-link-examples-upleveled.netlify.app';

// Invoke the function scrapeData() to get list of the first 10 images from the website
const imageSrcList = await scrapeData();
imageSrcList.forEach((el, index) => {
  let filePath;
  // create file path
  if (index < 9) filePath = `memes\\0${index + 1}.jpg`;
  else filePath = `memes\\${index + 1}.jpg`;
  // console.log(el.src + ' : ' + filePath);
  // download image and save to the file path
  downloadImage(el.src, filePath).catch(console.error);
});
// console.log(imageSrcList);

// Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $('#images div a');
    // Stores data for the first 10 image sources
    const imageLinks = [];
    // Use for loop through the a we selected
    for (let i = 0; i < 10; i++) {
      // Object holding data for each country/jurisdiction
      let src = '';
      const imageLink = { src: '' };
      src = $(listItems[i]).children('img').attr('src');
      // remove the substring '?width=300' from image source
      imageLink.src = src.slice(0, src.indexOf('?'));
      // Populate imageLinks array with image source
      imageLinks.push(imageLink);
    }
    return imageLinks;
  } catch (err) {
    console.error(err);
  }
}

async function downloadImage(imgUrl, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
  });
}
