# Volunteam App

## Project Scope

The goal of this app is to provide a secure, and accessible platform for volunteers and event organizers from their local communities to be able to find/create events quickly and easily.

## Project Root Folder Structure

```
assets/
src/
.gitignore/
App.tsx/
README.md/
app.config.ts/
babel.config.js/
db.json/
map-style.json/
package.json/
tsconfig.json/
yarn.lock/
```

## Dev Environment Setup + Running the App

### 1. Review all prerequisites are met:

#### Prerequisites:

- Node.js v20.x or newer
- npm v10.x or newer (or yarn v1.x NOT v2.x, has to be v1.x due to Expo)
- Expo CLI

  - ```
    npm install expo-cli -g
    ```

- Android Studio or a Physical Android device with Expo Go app installed

### 2. Install all dependencies:

Run either of the following in integrated terminal, please review project root folder structure:

```
npm install
```

**or**

```
yarn install
```

### 3. Set up the fake API (json-server)

Update the file `src/services/api.ts`.

Before running your 'json-server', get your computer's IP address and update your baseURL to `http://your_ip_address_here:3333` and then run:

```

npx json-server --watch db.json --port 3333 --host your_ip_address_here -m ./node_modules/json-server-auth

```

To access your server online without running json-server locally, you can set your baseURL to:

```

https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>

```

To use `my-json-server`, make sure your `db.json` is located at the repo root.

### 4. Set up the image upload API

Update the file `src/services/imageApi.ts`.

You can use any hosting service of your preference. In this case, we will use ImgBB API: https://api.imgbb.com/.
Sign up for free at https://imgbb.com/signup, get your API key and add it to the .env file in your root folder.

To run the app in your local environment, you will need to set the IMGBB_API_KEY when starting the app using:

```

IMGBB_API_KEY="insert_your_api_key_here" npx expo start

```

When creating your app build or publishing, import your secret values to EAS running:

```

eas secret:push

```

### 5. Start local JSON server and Expo

Run:

`expo start`
