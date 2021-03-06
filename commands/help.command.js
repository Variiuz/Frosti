const Discord = require('discord.js');
const client2 = new Discord.Client();
const config = require('../BotConfig.json');
module.exports = {
    name: "help",
    description: "Shows the Helppage",
    execute(message, args, client ){
        const avatar = client.user.avatarURL;
        const embedded = new Discord.RichEmbed();
        console.log(args);
        if(args.length === 1){
            const site = args[0];
            switch (args[0]) {
                default:
                    embedded.setColor(config.color)
                    .setTitle('')
                    .setAuthor('FrostBot', avatar)
                    .setDescription('Help Command <:Frosti:563030711905419289>')
                    .setThumbnail(avatar)
                    .addBlankField()
                    .addField(config.prefix+'character <Charactername>', 'Show some Information about the given Charactername.', true)
                    .setTimestamp()
                    .setFooter('requested by ' +message.author.username, message.author.avatarURL);
                    break;
            }
        }else if(args.length === 0){
            embedded.setColor(config.color)
            .setTitle('')
            .setAuthor('FrostBot', avatar)
            .setDescription('Help Command <:Frosti:563030711905419289>')
            .setThumbnail(avatar)
            .addBlankField()
            .addField(config.prefix+'character <Charactername>', 'Show some Information about the given Charactername.', true)
            .setTimestamp()
            .setFooter('requested by ' +message.author.username, message.author.avatarURL);
        }else {
            embedded.setColor(config.color)
            .setTitle('')
            .setAuthor('FrostBot', avatar)
            .setDescription('Help Command <:Frosti:563030711905419289>')
            .setThumbnail(avatar)
            .addBlankField()
            .addField(config.prefix+'character <Charactername>', 'Show some Information about the given Charactername.', true)
            .setTimestamp()
            .setFooter('requested by ' +message.author.username, message.author.avatarURL);
        }
        message.channel.send(embedded);
    }
}