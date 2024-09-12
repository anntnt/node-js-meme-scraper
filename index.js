import fs from 'node:fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

// URL of the page we want to scrape
const URL = 'https://memegen-link-examples-upleveled.netlify.app';
const DIR = './memes';

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

// Invoke the function scrapeData() to get list of the first 10 images from the website
const imageSrcList = await scrapeData(URL);
imageSrcList.forEach((el, index) => {
  let filePath;
  // create file path
  if (index < 9) filePath = `${DIR}\\0${index + 1}.jpg`;
  else filePath = `${DIR}\\${index + 1}.jpg`;
  // console.log(el.src + ' : ' + filePath);
  // download image and save to the file path
  downloadImage(el.src, filePath).catch(console.error);
});
// console.log(imageSrcList);
// test
const files = fs.readdirSync('./memes');
const filesAsString = files.join(',');

console.log(filesAsString);

const expectedFileHashes = {
  '01.jpg': '41a1efb58477bbf47c2270097c6a241557a335814794abde5977399dfd7331ba',
  '02.jpg': 'c9f186504728df2d81b243c72f794d999d649687f6e5efc46388d0e021249c4b',
  '03.jpg': 'c8bb155a9857c813f0930a2f2219122ceb975d982fdf12b39175f39994e1cf67',
  '04.jpg': 'b5560e8098843d65060439e530707b32ec207540990aa7a715db78c3983f1018',
  '05.jpg': 'b1d802552e8a3909fe1d62f66350faf82c36eac9d088d50026116d933ab2f013',
  '06.jpg': 'bb9b0ece0ef301f912e0b54a3e7d45d92e44a307c4b3cee28a4b80330dfc9bc7',
  '07.jpg': '7a14f0161f259d9de48a0ff8a5ddeaf97154b0a39fa219f4b296e5ad31f86156',
  '08.jpg': '47dd2de3c1633e624c582010fd4ee9cca60a7e612835b4d89f98ca199da397d5',
  '09.jpg': '29774b4cff11307c3e849f0cc4a63b3711810aa9449652edf8d72276ba6cf7db',
  '10.jpg': 'de1e6994215d88ed2a4d82d8336c6049c479a22c7a7a53bfb95ef6fe4a3335d4',
};
const expectedFilesAsString = Object.keys(expectedFileHashes).join(',');
console.log(expectedFilesAsString);
console.log(filesAsString === expectedFilesAsString);
// test

// Async function which scrapes the data
async function scrapeData(url) {
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

async function downloadImage(url, filepath) {
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
