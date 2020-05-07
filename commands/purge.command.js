const Discord = require('discord.js');
const client2 = new Discord.Client();
const config = require('../BotConfig.json');
module.exports = {
    name: "purge",
    description: "Purges Messages either defined by messageid from and to or just how many above the command",
    async execute(message, args, client ){
        const member = message.guild.member(message.author);
        if(!member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("🔒 You do not have permissions for this command.");
            //👍 🔧
            //-purge message message
            //-purge 100
            if (args.length === 1) {
                let length = args[0];
                if (!length) return message.channel.send("❌ You need to define how many messages should be purged.");
                if (isNaN(length)) return message.channel.send("❌ You need to define a number as the argument.");
                if(length > 99) return message.channel.send("❌ You currently cannot delete more than 99 messages at once.");
                if(length < 1) return message.channel.send("❌ You cannot delete less than 1 messages.");
                let t = length;
                t++;
                await message.channel.fetchMessages({ limit: t }).then(messages => { // Fetches the messages
                    message.channel.bulkDelete(messages).then(messages => message.channel.send(`👍 Purged ${messages.size} messages.`)).catch(function (error) {
                        console.log(error.messages);
                        if(error.code === 50034){
                            return message.channel.send("🔧 Cannot delete messages older than 14 days.");
                        }
                        return message.channel.send("🔧 Cannot delete messages.");
                    });
                }).catch(function (error) {
                    console.log(error);
                    return message.channel.send("🔧 Cannot delete messages.");
                });
            } else if (args.length === 2) {
                let a = args[0];
                let to = args[1];
                await message.channel.fetchMessages({ limit: 100, after: a, before: to }).then(messages => { // Fetches the messages
                    message.channel.bulkDelete(messages).then(messages => message.channel.send(`👍 Purged ${messages.size--} messages.`)).catch(function (error) {
                        console.log(error);
                        if(error.code === 50034){
                            return message.channel.send("🔧 Cannot delete messages older than 14 days.");
                        }
                        return message.channel.send("🔧 Cannot delete messages.");
                    })
                }).catch(function (error) {
                    console.log(error);
                    return message.channel.send("🔧 Cannot delete messages.");
                });
            } else {
                message.channel.send("🔧 You need to define how many messages should be purged.");
            }
        }
}