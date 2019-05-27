const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
var avatar = '';
const config = require('./CONFIG.json');
const shardServer = client.shard;
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
		const promises = [
			client.shard.fetchClientValues('guilds.size'),
			client.shard.broadcastEval('this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)')
		];
		Promise.all(promises).then(results => {
			const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
			const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
			console.log('ShardClient (id '+shardServer.id+') hooking into Bot ' + client.user.username + ' with '+ totalGuilds+ ' Guilds and '+ totalMembers+ ' Members in total.');
			}).catch(console.error);
  client.user.setActivity(config.presence.text, {
		"type": config.presence.statuscode
	});
  avatar = client.user.avatarURL;
});
//https://discordapp.com/oauth2/authorize?client_id=564484610583691264&permissions=8&scope=bot
client.on('message', message => {

	if (!message.content.startsWith(config.prefix)) return;
	if(message.channel.id === '582613034434822164' && message.content.startsWith('-verify ')){
		const uid = message.content.replace('-verify ', '');
		const userVer= message.guild.members.find('id', uid);
		if(userVer.roles.find('id','582610398151442447')){
			console.log('Found');
			userVer.removeRole('582610398151442447').catch(err => {
			});
			userVer.createDM().then(createdDM =>{
				createdDM.send('Removed the Verified Role <:sirblob:532942921759195166>');
			});
		}else{
			userVer.addRole('582610398151442447').catch(err => {
			});
			userVer.createDM().then(createdDM =>{
				createdDM.send('Added the Verified Role <:sirblob:532942921759195166>');
			});
		}
	}
	if(message.author.bot)return;

	const args = message.content.slice(config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);
	try {
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		command.execute(message, args, client);
		
	} catch (error) {
		console.error(error);
		message.reply("sorry but I can't understand what you want to say.");
	}
	
	/*

	const embeded = new Discord.RichEmbed();
	if(!message.author.bot /*|| message.mentions.users.find("id", client.user.id) === client.user){
		if(message.content.startsWith(config.prefix)){
			switch (message.content.toLowerCase().split(" ")[0]) {
				case "b!help":
					break;
				case "b!invite":
					client.generateInvite("ADMINISTRATOR").then(url => {
						embeded.setColor('#1c1c1c')
						.setAuthor('Blake', avatar)
						.setDescription('You want invite me <:blakeshock:563034747425521690>')
						.addField('Click this Link to add me to your Server <a:blakebongo:563034748209856712>', url, true)
						.setTimestamp()
						.setFooter(message.author.username, message.author.avatarURL);
						message.channel.send(embeded);
					});
					break;
				default:
					message.channel.send(`${message.author} Sorry but I don't know what you want from me..`);
					break;
			}
		}else if(message.content.toLowerCase() === "hey blake"){
					message.channel.send(`${message.author} meow~`);
		}
	}*/
});

client.login(config.token);
