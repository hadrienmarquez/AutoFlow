import fs from "fs";
import fsX from "fs-extra";
import path from "path";
import { spawn } from "child_process";
import env from "../config/index.js";
import dayjs from "dayjs";

import { readData } from "../models/versionModelController.js";

const tmpPath = "/usr/src/app/server/tmp";

async function makeTmp() {
  try {
    await fs.promises.mkdir(tmpPath);
    console.log("Making tmp folder........");
  } catch (error) {
    console.log(`Couldn't make tmp folder => ${error}`);
  }
}

async function delTmp() {
  try {
    await fs.promises.rmdir(tmpPath, { recursive: true });
    console.log("Deleting tmp folder........");
  } catch (error) {
    console.log(`Couldn't delete tmp folder => ${error}`);
  }
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const curlCMD = `curl ${url} --output ${dest}`;
    console.log(curlCMD);
    const cmd = spawn(curlCMD, { shell: true });

    cmd.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    cmd.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    cmd.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
}

async function decompress(source, dest) {
  return new Promise((resolve, reject) => {
    const unzipCMD = `unzip ${source} -d ${dest}`;
    console.log(unzipCMD);
    const cmd = spawn(unzipCMD, { shell: true });

    cmd.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    cmd.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    cmd.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
}

function move(source, dest) {
  const mvCMD = `mv ${source} ${dest}`;
  const cmd = spawn(mvCMD, { shell: true });

  cmd.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  cmd.stderr.on("data", (data) => {
    console.error(`stderr: ${data} \n
    Couldn't move ${source} to ${dest}...`);
  });

  cmd.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function tyflowArchive() {
  return new Promise(async (resolve, reject) => {
    // Fetching the date and formating it to make archive folder structure
    const today = dayjs();
    const folderName = "tyflow_" + today.format("MM-DD-YYYY");

    //   Path to old max 2020 and 2021 archive folder
    const oldmax20Path = path.join(env.oldmax20Path, folderName);

    const oldmax21Path = path.join(env.oldmax21Path, folderName);
    console.log(oldmax20Path);
    //   Making directory structure for each archive
    try {
      await fs.promises.mkdir(oldmax20Path);
      console.log(`Making ${folderName} folder in Max 2020.....`);
    } catch (error) {
      console.log(`Couldn't make ${folderName} folder => ${error}`);
      reject();
    }

    try {
      await fs.promises.mkdir(oldmax21Path);
      console.log(`Making ${folderName} folder in Max 2021.....`);
    } catch (error) {
      console.log(`Couldn't make ${folderName} folder => ${error}`);
      reject();
    }

    // Moving TyFlow dlo to archive
    move(
      path.join(env.curmax20Path, env.tyfile),
      path.join(oldmax20Path, env.tyfile)
    );

    move(
      path.join(env.curmax21Path, env.tyfile),
      path.join(oldmax21Path, env.tyfile)
    );

    let cache;
    //   CUDA FROM CACHE
    try {
      cache = await readData("/usr/src/app/server/models/cache.json");
    } catch (error) {
      console.log(`Couldn't access cache => ${error}`);
    }

    if (cache.current_cuda != cache.new_cuda) {
      // Moving CUDA to archive
      move(
        path.join(env.curmax20Path, "cuda"),
        path.join(oldmax20Path, "cuda")
      );

      move(
        path.join(env.curmax21Path, "cuda"),
        path.join(oldmax21Path, "cuda")
      );
    }

    setTimeout(resolve, 2000);
  });
}

function tyflowDownload() {
  return new Promise(async (resolve, reject) => {
    makeTmp();
    let cache;
    let bTy = false;
    let bCuda = false;

    //   VERSION FROM CACHE
    try {
      cache = await readData("/usr/src/app/server/models/cache.json");
    } catch (error) {
      console.log(`Couldn't access cache => ${error}`);
    }

    // TYFLOW
    download(
      env.tydownloadURL + cache.new_version,
      path.join(tmpPath, "tyflow_" + cache.new_version + ".zip")
    )
      .then(async () => {
        await decompress(
          path.join(tmpPath, "tyflow_" + cache.new_version + ".zip"),
          tmpPath
        );
        const files = await fs.promises.readdir(tmpPath);
        for (const file of files) {
          if (file != env.tyfile && file != "cuda") {
            fs.promises.unlink(path.join(tmpPath, file));
          }
        }
        // Moving TyFlow dlo to archive
        try {
          await fsX.copy(
            path.join(tmpPath, env.tyfile),
            path.join(env.curmax20Path, env.tyfile)
          );

          await fsX.copy(
            path.join(tmpPath, env.tyfile),
            path.join(env.curmax21Path, env.tyfile)
          );
        } catch (error) {
          console.log(`Couldn't copy ${env.tyfile} => ${error}`);
        }

        if (bCuda) {
          delTmp();
          console.log(`Stock updated!`);
          resolve();
        } else {
          bTy = true;
        }
      })
      .catch((error) => {
        console.log(error);
        reject();
      });

    // CUDA
    if (cache.current_cuda != cache.new_cuda) {
      download(env.cudadownloadURL, path.join(tmpPath, "cuda.zip"))
        .then(() => {
          console.clear();
          fs.mkdir(path.join(tmpPath, "cuda"), async (err) => {
            if (err) {
              console.log(`Error => ${error}`);
              reject();
            }
            await decompress(
              path.join(tmpPath, "cuda.zip"),
              path.join(tmpPath, "cuda")
            );

            // Moving CUDA folder to stock
            try {
              await fsX.copy(
                path.join(tmpPath, "cuda"),
                path.join(env.curmax20Path, "cuda")
              );

              await fsX.copy(
                path.join(tmpPath, "cuda"),
                path.join(env.curmax21Path, "cuda")
              );
            } catch (error) {
              console.log(`Couldn't copy CUDA folders => ${error}`);
            }

            if (bTy) {
              delTmp();
              console.log(`Stock updated!`);
              resolve();
            } else {
              bCuda = true;
            }
          });
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    } else {
      bCuda = true;
    }
  });
}

export { tyflowArchive, tyflowDownload };
