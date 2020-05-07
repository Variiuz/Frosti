const Discord = require('discord.js');
const client2 = new Discord.Client();
const config = require('../BotConfig.json');
module.exports = {
    name: "kick",
    description: "Kicks a defined user or UserID.",
    async execute(message, args, client ){
        const member = message.guild.member(message.author);
        const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
        if(!member.hasPermission('KICK_MEMBERS')) return message.channel.send("🔒 You do not have permissions for this command.");
            if (args.length === 1) {
                let idu = args[0];
                let mention = message.mentions.users.first();
                let toKick;
                if(mention === undefined){
                    toKick = message.guild.members.find('id', idu);
                    if(toKick === null) return message.channel.send("🔧 Cannot find a User with that ID.");
                }else {
                    toKick = message.guild.member(mention);
                }

                if(toKick === member) return message.channel.send("🔒 You cannot kick yourself.");
                if(toKick.hasPermission('KICK_MEMBERS') && !member.hasPermission('ADMINISTRATOR')) return message.channel.send("🔒 You do not have permissions to kick this user.");
                toKick.createDM().then(createdDM => {
                    createdDM.send(`🔒 You have been kicked from \`${message.guild.name}\`. Reason [\`No Reason given\`]`).then(() => {
                        toKick.kick().then(() => message.channel.send(`👍 Kicked \`${toKick.user.username}#${toKick.user.discriminator}\`.`)).catch(function (error) {
                            console.log(error);
                            return message.channel.send("🔧 An error occured, cannot kick user.");
                        });
                    }).catch(console.log);
                }).catch(console.log);
            } else if (args.length >= 2) {
                let idu = args[0];
                let reason = "";
                let mention = message.mentions.users.first();
                let toKick;
                if(mention === undefined){
                    toKick = message.guild.members.find('id', idu);
                    if(toKick === null) return message.channel.send("🔧 Cannot find a User with that ID.");
                }else {
                    toKick = message.guild.member(mention);
                }
                for (let i = 1; i < args.length; i++) {
                    if(i === 1) reason += args[i];else reason += " "+args[i];
                }

                if(toKick === member) return message.channel.send("🔒 You cannot kick yourself.");
                if(toKick.hasPermission('KICK_MEMBERS') && !member.hasPermission('ADMINISTRATOR')) return message.channel.send("🔒 You do not have permissions to kick this user.");
                toKick.createDM().then(createdDM => {
                    createdDM.send(`🔒 You have been kicked from \`${message.guild.name}\`. Reason [\`${reason}\`]`).then(() => {
                        toKick.kick(reason).then(() => message.channel.send(`👍 Kicked \`${toKick.user.username}#${toKick.user.discriminator}\` for \`${reason}\``)).catch(function (error) {
                            console.log(error);
                            return message.channel.send("🔧 An error occured, cannot kick user.");
                        });
                    }).catch(console.log);
                }).catch(console.log);

            } else {
                message.channel.send("🔧 You need to define how many messages should be purged.");
            }
        }
    }