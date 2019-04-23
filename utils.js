const fetch = require('node-fetch')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const readlineSync = require('readline-sync');

let settings = {}

let getMalInfo = username => {
    return fetch(`https://myanimelist.net/animelist/${username}/load.json?offset=0&status=1`)
        .then(res => res.json())
        .then(body => {
            let anime = body
            let t = anime.reduce((total, current) => {
                total[ current.anime_title ] = current.num_watched_episodes
                return total
            }, {})

            return t
        })
}

let checkSettings = async () => {
	try {
		let settingsFile = JSON.parse(fs.readFileSync('./settings.json'))
        settings = settingsFile
        console.log('Successfully loaded settings.')
	} catch (error) {
        console.log('No settings file found, creating one right now...')

        let downloadFolder = readlineSync.question('Download folder (where torrents are stored, default to ~/Downloads): ', {
            defaultInput: '~/Downloads'
        })
        settings.downloadFolder = downloadFolder

        let tmpFolder = readlineSync.question('Temporary download folder (leave empty if equals to download): ', {
            defaultInput: downloadFolder
        })
        settings.tmpFolder = tmpFolder

        if(readlineSync.keyInYN('Do you want to use MyAnimeList as source? ')) {
            settings.useMAL = true
            let username = readlineSync.question('MAL username: ')
            settings.malUsername = username
        } else {
            settings.useMAL = false
        }

	} finally {
        fs.writeFileSync('./settings.json', JSON.stringify(settings))
        return settings
    }
}

module.exports = {
    getMalInfo: getMalInfo,
    checkSettings: checkSettings
}