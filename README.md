# Twitter Ticker Mention Scraper

This project is a Node.js application that scrapes Twitter accounts to count mentions of a specific stock ticker symbol. It uses Puppeteer for web scraping and Cheerio for parsing HTML.

## Features

- Scrapes multiple Twitter accounts specified in a file
- Searches for a specific stock ticker symbol in tweets
- Runs at specified intervals
- Uses a random user agent for each request to avoid detection
- Scrolls through the Twitter feed to load more content

## Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/hasan00gad148/Xscraper/
   cd Xscraper
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

Run the scraper with the following command:

```
node ./src/scraper.js <path_to_accounts_file> <ticker_symbol> <interval_in_minutes>
```

For example:
```
node ./src/scraper.js accounts.txt $AAPL 15
```

This will:
1. Read Twitter accounts from `accounts.txt`
2. Search for mentions of '$AAPL'
3. Run every 15 minutes



For quick test: 
```
npm run scrape  //to run the javaScript
or 
npm run scrapeTS  //to run the typeScript
```

## Configuration
- `accounts.txt`: A text file containing Twitter account URLs, one per line.
- `ticker`: The stock symbol to search for in tweets.
- `scrapeInterval`: The interval between scraping runs, in minutes.

## Output
The script will print the number of times the specified ticker was mentioned across all accounts.
## Limitations

- This scraper does not use Twitter's official API and may be subject to rate limiting or blocking.
- It relies on the current structure of Twitter's website, which may change over time.


## License

[MIT](https://choosealicense.com/licenses/mit/)
