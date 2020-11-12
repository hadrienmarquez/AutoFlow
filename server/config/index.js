import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  email_password: process.env.EMAIL_PASSWORD,
  cur_it_folder: process.env.CUR_PATH,
  old_it_folder: process.env.OLD_PATH,
};
