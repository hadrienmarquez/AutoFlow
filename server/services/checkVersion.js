async function getVersion(pageInstance, url) {
  let page;
  try {
    page = await pageInstance;
  } catch (error) {
    console.log(`Couldn't resolve the page => ${error}`);
  }

  try {
    console.log(`Navigating to ${url} .......`);
    await page.goto(url);
  } catch (error) {
    console.log(`Couldn't open ${url} => ${error}`);
  }

  let new_version;
  //   Getting the version by parsing button.value
  try {
    console.log(`Getting new version of TyFlow.......`);
    new_version = await page.$eval(
      "#body-inner > form:nth-child(5) > p:nth-child(3) > button:nth-child(1)",
      (el) => el.value.split("_")[1]
    );
  } catch (error) {
    console.log(`Couldn't get version of TyFlow =>  ${error}`);
  }

  return new_version;
}

async function checkVersion(pageInstance, url) {
  let new_version;

  try {
    new_version = await getVersion(pageInstance, url);
    console.log(`New version of TyFlow: ${new_version}......`);
  } catch (error) {
    console.log(`Error => ${error}`);
  }
}

//   Accepting conditions for download, not going here
//   try {
//     console.log("Accepting EULA conditions.....");
//     await page.click("#field_terms");
//   } catch (error) {
//     console.log(`Couldn't accept conditions => ${error}`);
//   }

export { checkVersion };
