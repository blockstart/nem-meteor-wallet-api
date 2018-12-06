# NEM Meteor Wallet API
This API can be used in both web and mobile projects.  It was built to be used with the NEM Meteor Wallets.

# Getting Started

1. Clone this repo
2. Install and use Node 10x+
3. Run `npm install`
4. Run `npm run dev` to start a dev server

For production run: `npm run build` and use output files in your app or server.

# If you get UWS errors do this:
rm node_modules/engine.io/lib/server.js
cp config/server.js node_modules/engine.io/lib/server.js

npm run start
