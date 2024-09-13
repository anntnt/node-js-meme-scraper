import fs from 'node:fs';
import client from 'node:https';
import fetch from 'node-fetch';

// fetching Data from URL

await fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((response) => response.text())

  .then((data) => {
    let m;
    const urls = [];
    const str = data;

    // Regular expression to extract image URLs from HTML content

    const rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

    while ((m = rex.exec(str))) {
      urls.push(m[1]);
    }

    // Limit the array of urls to the first 10

    const imageUrlData = urls.slice(0, 10);
    console.log(imageUrlData);

    // Loop over each of the first 10 URLs in the array

    imageUrlData.forEach((url, i) => {
      console.log(url);
      const content = url;

      const folderExists = fs.existsSync('memes');
      console.log(folderExists);

      if (folderExists) {
        console.log('memes folder already exists');
      } else {
        fs.mkdirSync('memes');
        console.log('memes folder created');
      }
      // Put the image data inside of the file and save it

      function downloadImage(image, filepath) {
        return new Promise((resolve, reject) => {
          client.get(image, (res) => {
            if (res.statusCode === 200) {
              res
                .pipe(fs.createWriteStream(filepath))
                .on('error', reject)
                .once('close', () => resolve(filepath));
            } else {
              res.resume();
              reject(
                new Error(
                  `Request Failed With a Status Code: ${res.statusCode}`,
                ),
              );
            }
          });
        });
      }

      // file name with the leading zero

      if (i >= 9) {
        downloadImage(content, `memes/${i + 1}.jpg`)
          .then(console.log)
          .catch(console.error);
      } else {
        console.log('Downloading ');
        downloadImage(content, `memes/0${i + 1}.jpg`)
          .then(console.log)
          .catch(console.error);
      }
    });
  })
  .catch((error) => {
    console.error(error);
  });
