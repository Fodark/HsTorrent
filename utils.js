const fetch = require('node-fetch')

let getMalInfo = username => {
    return fetch(`https://api.jikan.moe/v3/user/${username}/animelist/watching`)
        .then(res => res.json())
        .then(body => {
            let anime = body.anime
            let t = anime.reduce((total, current) => {
                total[ current.title ] = current.watched_episodes
                return total
            }, {})

            return t
        })
}

module.exports = {
    getMalInfo: getMalInfo
}