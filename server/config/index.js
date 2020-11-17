import dotenv from "dotenv";

dotenv.config();

export default {
  email_dest: process.env.EMAIL_DEST,
  email_password: process.env.EMAIL_PASSWORD,
  email_adress: process.env.EMAIL_ADRESS,
  auth_client_id: process.env.CLIENT_ID,
  auth_client_secret: process.env.CLIENT_SECRET,
  auth_redirect_url: process.env.REDIRECT_URL,
  auth_refresh_token: process.env.REFRESH_TOKEN,
  t_path: process.env.T_PATH,
  workdir: process.env.WORKDIR,
  oldmax20Path: process.env.OLD_PATH_MAX_2020,
  oldmax21Path: process.env.OLD_PATH_MAX_2021,
  curmax20Path: process.env.CUR_PATH_MAX_2020,
  curmax21Path: process.env.CUR_PATH_MAX_2021,
  tyfile: process.env.TYFILE,
  tydownloadURL: process.env.TYFLOW_DL_URL,
  cudadownloadURL: process.env.CUDA_DL_URL,
};
