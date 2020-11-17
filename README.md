# AutoFlow

Web scrapping for automatic download of TyFlow for Max2020 and Max2021

The webscraper will:

- Check if a new version of TyFlow is available.
- Check if the CUDA dll are up-to-date as well.
- Send an email through a Gmail account to notify the new version.
- Open a prompt and wait for confirmation.
- If yes, it will download TyFlow as well as CUDA if the version is different.
- It will archive old versions and put the new into a stock folder.
- Finally it will sleep until next day and check again.

## Configuration : .env

The tool is very specific and most of the config is done in the .env file.
Here are the configuration settings necessary for the app to work.

### WORKDIR

Working directory of docker.
e.g

```
WORKDIR=/usr/src/app
```

### T_PATH

**T_PATH** is the target path. It will be used to bind your disk to the './stock/' folder inside Docker container.

#### './stock/' folder

The app is assuming under the './stock/' a directory structure looking like this:

```
./stock/                                        => T_PATH
|
├── some_directory_for_current_versions/
|   |
│   ├─────── directory_for_max2020_plugins/     => CUR_PATH_MAX_2020
|   |
│   └─────── directory_for_max2021_plugins/     => CUR_PATH_MAX_2021
|
└── some_directory_for_old_versions
    |
    ├─────── directory_for_max2020_plugins/     => OLD_PATH_MAX_2020
    |
    └─────── directory_for_max2021_plugins/     => OLD_PATH_MAX_2021
```

### CUR_PATH_MAX_2020, CUR_PATH_MAX_2021, OLD_PATH_MAX_2020, OLD_PATH_MAX_2021

Different path to current version plugin folder and archived version, all in the docker environment. The path is expected to start with 'WORKDIR/stock/' so be

- **CUR_PATH_MAX_2020** is the path to the current plugin folder for max 2020 in the docker environment.
- **CUR_PATH_MAX_2021** is the path to the current plugin folder for max 2021 in the docker environment.
- **OLD_PATH_MAX_2020** is the path to the old plugin folder for max 2020 in the docker environment.
- **OLD_PATH_MAX_2021** is the path to the old plugin folder for max 2021 in the docker environment.

e.g :

```
CUR_PATH_MAX_2020=/usr/src/app/stock/current/001_3DSmax_2020/
CUR_PATH_MAX_2021=/usr/src/app/stock/current/001_3DSmax_2021/

OLD_PATH_MAX_2020=/usr/src/app/stock/old/001_3DSmax_2020/
OLD_PATH_MAX_2021=/usr/src/app/stock/old/001_3DSmax_2021/
```

### TYFLOW_DL_URL, CUDA_DL_URL

The URL used for curl download, as of today they are :

```
TYFLOW_DL_URL=http://apps.tysonibele.com/tyflow/beta/Download.php\?eula\=on\&version\=tyFlow_
CUDA_DL_URL=http://apps.tysonibele.com/tyflow/CUDA/Download.php\?version\=tyFlow_CUDA
```

### TYFILE

Expects :

```
TYFILE=tyFlow_2020.dlo
```

### EMAIL OAuth CONFIGURATION

To use Gmail with Nodemailer you can follow this [tutorial](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1). The tutorial will enable OAuth authentification to the GMail API services.

This will allow you to configure the following environment variables :

```
REDIRECT_URL=
CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=
```

### EMAIL_ADRESS, EMAIL_PASSWORD, EMAIL_DEST

Additionnally you will need to give the email and password of your Gmail account.

EMAIL_ADRESS=something@dot.com
EMAIL_PASSWORD=yourpassword

**EMAIL_DEST** is the email destination it can be either one mail or a list of mails.
e.g :

```
# Single adress
EMAIL_DEST=yourdestination@dot.com

# Mail list
EMAIL_DEST="yourdest1@dot.com, yourdest2@dot.com, etc..."
```
