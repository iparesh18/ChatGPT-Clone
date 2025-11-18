const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

// ---------- CHEERIO SCRAPER (FAST) ----------
async function cheerioScrape(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    let text = $("body").text().replace(/\s+/g, " ").trim();

    if (text && text.length > 50) {
      return text.slice(0, 5000);
    }

    return "";
  } catch (err) {
    return "";
  }
}

// ---------- PUPPETEER SCRAPER (JS-RENDERED WEBSITES) ----------
async function puppeteerScrape(url) {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0");

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const text = await page.evaluate(() => document.body.innerText);

    await browser.close();

    if (text && text.length > 50) {
      return text.slice(0, 5000);
    }

    return "";
  } catch (err) {
    return "";
  }
}

// ---------- MAIN SCRAPER ----------
async function scrapeWebsite(url) {
  console.log("🔍 SCRAPING URL:", url);

  // 1️⃣ Try Cheerio (fast)
  let text = await cheerioScrape(url);
  if (text && text.length > 50) {
    console.log("⚡ Cheerio Success");
    return text;
  }

  // 2️⃣ Try Puppeteer for all JS websites
  console.log("⏳ Falling back to Puppeteer...");
  text = await puppeteerScrape(url);

  if (text && text.length > 50) {
    console.log("🔥 Puppeteer Success (JS-rendered website)");
    return text;
  }

  console.log("❌ Failed to scrape");
  return "Error scraping website";
}

module.exports = { scrapeWebsite };
