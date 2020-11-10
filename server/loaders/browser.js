import puppeteer from "puppeteer";

// Launching a browser session
async function loadBrowser() {
  let browser;
  try {
    console.log("Opening browser...");
    browser = await puppeteer.launch({
      ignoreHTTPSError: true,
      headless: true,
      args: ["--disable-setuid-sandbox", "--no-sandbox"],
      executablePath: process.env.CHROMIUM_PATH,
    });
  } catch (error) {
    console.log(`Could not create a browser instance => ${error}`);
  }

  return browser;
}

export { loadBrowser };
