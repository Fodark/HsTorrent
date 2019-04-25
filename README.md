# HS Torrent downloader

Automated torrent downloader from nyaa.si (HorribleSubs releases) based on a list of series you follow.

## What does this program do?
The programs checks on MyAnimeList if you've already seen the latest of episodes of the series you follow, if not it checks in your transmission download folder
if the relative file is already present or downloading, and then, if also this is false, it loads the magnet link in transmission to download!

## Dependencies
- Node.js
- transmission command-line interface (`transmission-remote`)

## How to run it
- Clone this repo locally
- `npm install` to fetch needed libraries
- `npm start` to start it, if it is your first time running the program it will ask for some configuration

## Which files does it use?
As it is now, it check in `following.json` the name of the series you follow and its MyAnimeList equivalent name, but I'm planning to automate also this part.
If you don't have a MyAnimeList account, you should use `lastseen.js` to keep track of the last episode you saw, I'll try to make this painless.
