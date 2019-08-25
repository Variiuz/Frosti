const Discord = require('discord.js');
const client2 = new Discord.Client();
const config = require('../CONFIG.json');
const fetch = require('node-fetch');
var deleteMessage = false;
module.exports = {
    name: "character",
    cooldown: 10,
    description: "Show some Information about the given Charactername.",
    execute(message, args, client ){
        const avatar = client.user.avatarURL;
        const embeded = new Discord.RichEmbed();
        if(args.length === 1){
            const querystring = args[0];
            var body = null;
            fetch(`https://api.afterfall-game.com/callback/characters/name/`+querystring, {
                headers: {
                     'Content-Type': 'application/json',
                     'Authorization': 'Bearer '+config.AFAPIT,
                    }
            }).then(response => 
                response.json()).then(json => {
                    if(json.response !== 'OK'){
                        if(json.message === 'Character not found.'){
                            embeded.setColor(config.color)
                            .setDescription('A Character with the name '+args[0]+ ' could not be found.');
                        }else {
                            embeded.setColor(config.color)
                            .setDescription('There is something wrong with our API Endpoint. Please try again in a few minutes.');
                            console.log(json);
                        }
                    }else {
                        var rowCount = json.rowCount;
                        if(rowCount === 1){
                            embeded.setColor(config.color)
                            .setTitle('Character Lookup')
                            .setDescription('Character Result for '+json['characters'][0].name)
                            .addBlankField()
                            .addField('Name', json['characters'][0].name, true)
                            .addField('Level', json['characters'][0].level, true)
                            .addField('Playtime', json['characters'][0].playtime, true)
                            .addBlankField()
                            .addField('Created', json['characters'][0].created.split('T')[0], true)
                            .setTimestamp()
                            .setFooter('requested by ' +message.author.username, message.author.avatarURL);
                            message.channel.send(embeded);
                        }else {
                            if(rowCount > 5)rowCount = 5;
                            var array = [];
                            for(var i = 0; i < (rowCount);i++){
                                array.push(json['characters'][i]);
                             }
                             message.reply('Character Result for name '+args[0]+ ' returned '+rowCount+ ' entries. Multiple Characters are currently just supported by showing them all.');
                             array.forEach(sysp =>{
                                var embed = new Discord.RichEmbed();
                                embed.setColor(config.color)
                                .setTitle('Character Lookup')
                                .setDescription('Character Result for '+sysp.name)
                                .addBlankField()
                                .addField('Name', sysp.name, true)
                                .addField('Level', sysp.level, true)
                                .addField('Playtime', sysp.playtime, true)
                                .addBlankField()
                                .addField('Created', sysp.created.split('T')[0], true)
                                .setTimestamp()
                                .setFooter('requested by ' +message.author.username, message.author.avatarURL);
                                message.channel.send(embed);
                             });
                        }
                    }
                }).catch(err => console.log(err));
        }else if(args.length === 0){
            embeded.setColor(config.color)
            .setDescription('Please give me a Charactername for the search.');
            message.channel.send(embeded);
        }else {
            embeded.setColor(config.color)
            .setDescription('Please give me a Charactername for the search.');
            message.channel.send(embeded);
        }
    }
}