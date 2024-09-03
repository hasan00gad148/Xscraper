
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const randomUseragent = require('random-useragent');
const fs  = require('fs');


// Inputs
console.log(process.argv)
const accountsPath = process.argv[2]
const accounts = fs.readFileSync(accountsPath, 'utf-8').split(/\r?\n/);

const ticker = process.argv[3]; // Stock symbol to look for
const scrapeInterval = Number(process.argv[4]) * 60 * 1000; // 15 minutes in milliseconds

// Function to scrape a Twitter account
async function scrollTOloadMoreContent(page){
  try{
    let lastHeight;
    let k = 5
    while (k) {
      lastHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await new Promise(resolve => setTimeout(resolve, 2500));
      const newHeight = await page.evaluate('document.body.scrollHeight');
      k-=1
      if (newHeight === lastHeight) break;
    }
  }
  catch(e){console.log(e.message)}
}

async function scrapeAccount(browser, url) {
  try {

    const page = await browser.newPage();

      // //Random userAgent Rotation 
    // const userAgent = randomUseragent.getRandom();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    const response =  await page.goto(url,  { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('article');

    // //Scroll to load more tweets
    await scrollTOloadMoreContent(page)


  // Get the page content
    if (response.status() === 200) {
      const content = await page.content();
      const root = cheerio.load(content);
// Look for tweets
      let tickerMentions = 0;
      root('div article').each((index, element) => {
        const tweetText = root(element).text();
        // Count occurrences of the ticker in the tweets
        tickerMentions += tweetText.includes(ticker)
      });

      
    await page.close();
    return tickerMentions;


    } else {
      console.log(`Failed to retrieve data from ${url}`);
      return 0;
    }
  } catch (error) {
    console.log(`Error scraping ${url}:`, error.message);
    return 0;
  }
}



// Function to run the scraper periodically
async function runScraper() {
  let totalMentions = 0;
  const browser = await puppeteer.launch({
    headless: 0,
    defaultViewport: null,
    args: ['--window-size=1000,800']
  });
  for (const account of accounts) {
    const mentions = await scrapeAccount(browser, account);
    totalMentions += mentions;
  }
  browser.close()
  // Output the result
  console.log(`'${ticker}' was mentioned '${totalMentions}' times in the last '${scrapeInterval / 60000}' minutes.`);

  // Wait for the next scrape session

}

// Start the scraper

setInterval(async() => await runScraper(), scrapeInterval);
runScraper()