const Discord = require('discord.js');
const client2 = new Discord.Client();
const config = require('../BotConfig.json');
const fetch = require('node-fetch');
var deleteMessage = false;
async function getTitle(id) {
    let response = await fetch(`https://api.afterfall-game.com/v3/api/title/`+ id, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+config.AfterfallToken,
           }
    });
    let data = await response.json()
    return response.status
}

var exports = module.exports = {};
const util = require('util');
module.exports = {
    name: "character",
    cooldown: 10,
    description: "Show some Information about the given name.",
    async execute(message, args, client ){
        const embedded = new Discord.RichEmbed();
        if(args.length === 1){
            const querystring = args[0];
            var body = null;
            let status;
            console.log(querystring);
            fetch(`https://api.afterfall-game.com/v3/api/search/character/name/`+querystring, {
                headers: {
                     'Content-Type': 'application/json',
                     'Authorization': 'Bearer '+config.AfterfallToken,
                    }
            }).then((res) => {
                status = res.status;
                return res.json();
            }).then(json => {
                    if(status !== 200){
                        if(status === 404){
                            embedded.setColor(config.color)
                            .setDescription('A Character with the name '+args[0]+ ' could not be found or is set private.');
                            message.channel.send(embedded);
                        }else {
                            embedded.setColor(config.color)
                            .setDescription('There is something wrong with our API Endpoint. Please try again in a few minutes.');
                            message.channel.send(embedded);
                            console.log(json);
                        }
                    }else {
                        const charName = json['name'];
                        const charUiD = json['character_uid'];
                        const charCreatedAt = json['created'];
                        const charPlayTime = json['playtime'];
                        const charLevel = json['level'];
                        const charDZ = json['dz_level'];
                        const charTitleId = json['title_id']; // For further requests.
                        let charTitle;
                        fetch(`https://api.afterfall-game.com/v3/api/title/`+ charTitleId, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+config.AfterfallToken,
                               }
                        }).then((res) => {
                            status = res.status;
                            return res.json();
                        }).then(js => {
                            if(status === 200){
                                charTitle = js['name'];
                            }else {
                                charTitle = "Unknown";
                            }
                            
                            embedded.setColor(config.color)
                            .setTitle('Character '+charName)
                            .setDescription('Information about  '+charName)
                            .addField('Name',charName, true)
                            .addField('Exp', charLevel, true)
                            .addField('DZ Exp', charDZ, true)
                            .addField('Current Title', charTitle, true)
                            .addField('Playtime', charPlayTime, true)
                            .addField('Created', charCreatedAt.split('T')[0], true)
                            .setTimestamp()
                            .setFooter('requested by ' +message.author.username, message.author.avatarURL)
                            .attachFile([img]);
                            message.channel.send(embedded);
                        }).catch(err => {
                            embedded.setColor(config.color)
                            .setDescription('There was an error while fetching the current Character Title.');
                            message.channel.send(embedded);
                            console.log("TitleErr: "+err);
                        });
                    }
                }).catch(err => {
                    embedded.setColor(config.color)
                    .setDescription('There is something wrong with the API route. The error has been logged for further investigations.');
                    message.channel.send(embedded);
                    console.log('Error while fetching a Char. ERROR: ');
                    
                    console.log(err);
                });
        } else {
            embedded.setColor(config.color)
            .setDescription('Please give me a Charactername for the search.');
            message.channel.send(embedded);
        }
    }
}