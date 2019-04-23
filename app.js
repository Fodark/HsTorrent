const { si } = require('nyaapi')
const { anime, malEquivalent } = require('./following')
const { getMalInfo, checkSettings } = require('./utils')
const _ = require('lodash')
const fs = require('fs')
const { exec } = require('child_process')

let settings, intervalCode, dFolder, tFolder

let searchAnime = (i, name, lastEp) => {
	if (i >= anime.length) {
		clearInterval(intervalCode)
		process.exit(0)
	}

	si.search('[HorribleSubs] ' + name, 20, { category: '1_2' })
		.then(data => {
			let sorted = _.orderBy(data, ['timestamp'], ['desc'])
			sorted = sorted.map(s => {
				return {
					name: s.name,
					magnet: s.links.magnet,
					size: s.fileSize
				}
			})
			const regex = new RegExp('1080p')
			sorted = sorted.filter(s => regex.test(s.name))
			sorted = sorted[0]
			return sorted
		})
		.then(entry => {
			let split = entry.name.split('-')
			let epNumber = parseInt(split[split.length - 1])
			if (lastEp == epNumber) {
				console.log(`You already saw the last episode of ${name} (${lastEp})`)
			} else if (!dFolder.includes(entry.name) && !tFolder.includes(`${entry.name}.part`)) {
				console.log(`Gotta download episode ${epNumber} of ${name}`)
				exec(`transmission-remote -a ${entry.magnet}`)
			} else {
				console.log(`You already have the latest episode of ${name} but you haven\'t seen it yet (${epNumber})`)
			}
			return true
		})
		.catch(err => console.log(err))
}

function main() {
	checkSettings()
	.then(s => {
		settings = s
		dFolder = fs.readdirSync(settings.downloadFolder)
		tFolder = fs.readdirSync(settings.tmpFolder)
		return getMalInfo(settings.malUsername)
	})
	.then(malInfo => {
		let i = 0
		intervalCode = setInterval(() => {
			let name = anime[i]
			searchAnime(i++, name, malInfo[malEquivalent[name]])
		}, 2000)
	})
}

main()
