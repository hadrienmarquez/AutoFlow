import readline from "readline";

async function promptConfirm() {
  const app = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let validInput = false;

  const recursiveQuestion = (resolve) => {
    app.question("Download TyFlow's new version (y/n)?\n", (answer) => {
      if (answer === "y" || answer === "n") {
        validInput = true;
        resolve(answer == "y" ? true : false);
        return app.close();
      } else {
        console.clear();
        console.log(`${answer} is not a valid answer...\n`);
        recursiveQuestion(resolve);
      }
    });
  };

  let result = await new Promise((resolve) => {
    setTimeout(() => {
      console.clear();
      recursiveQuestion(resolve);
    }, 3000);
  });

  return result;
}

export { promptConfirm };
