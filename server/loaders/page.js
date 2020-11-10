async function loadPage(browserInstance) {
  let browser, page;
  try {
    browser = await browserInstance;
  } catch (error) {
    console.log(`Couldn't resolve the browser instance ${error}`);
  }

  try {
    console.log("Opening new page.......");
    page = await browser.newPage();
  } catch (error) {
    console.log(`Couldn't open page => ${error}`);
  }

  return page;
}

export { loadPage };
