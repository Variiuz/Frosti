const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
var avatar = '';
const config = require('./BotConfig.json');
const shardServer = client.shard;
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let message_id = '695935661596868618'
let channel_id = '695933930578247740'
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', async () => {
		const promises = [
			client.shard.fetchClientValues('guilds.size'),
			client.shard.broadcastEval('this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)')
		];
		Promise.all(promises).then(results => {
			const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
			const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
			console.log('ShardClient (id '+shardServer.id+') hooking into ' + client.user.username + ' with '+ totalGuilds+ ' Guilds and '+ totalMembers+ ' Members in total.');
			}).catch(console.error);
  		client.user.setActivity(config.presence.text, {
		"type": config.presence.type
		});
		client.channels.get(channel_id).fetchMessage(message_id).then(m => {
			console.log("Cached reaction message.");
		}).catch(e => {
			console.error("Error loading message.");
		});

  avatar = client.user.avatarURL;
});
client.on('messageReactionAdd', (reaction, user) => {
	if(reaction.emoji.name === "✅" && reaction.message.id === message_id) {
		reaction.message.guild.fetchMember(user)
			.then((member) => {
				if(!member.roles.find('id','695928653904740443')){
					member.addRole('695928653904740443').catch(err => {
					});
					member.createDM().then(createdDM =>{
						createdDM.send('You accepted the Rules, have fun. <:pikaup:671103142217252865>');
					});
				}
		});
	}
});
client.on('guildMemberAdd', (user) => {
	if(user.guild.id === '500356704446316567') {
		user.createDM().then(createdDM => {
			createdDM.send('Please read #welcome-new-users to accept our Rules and begin chatting <:pikaup:671103142217252865>');
		});
	}
});

client.on('userUpdate', (oldUser, newUser)=> {
	if(newUser.username === 'here' || newUser.username === 'heree' || newUser.username === 'hereee' || newUser.username === 'everyone'|| newUser.username === 'everyonee'|| newUser.username === 'everyoneee'){
		newUser.createDM().then(createdDM =>{
			createdDM.send('I\'ve noticed that you changed your Username to something with "here" or "everyone". Please change it or you will be kicked from our Server. You have been flagged.');
		});
	}
});

//https://discordapp.com/oauth2/authorize?client_id=564484610583691264&permissions=8&scope=bot
client.on('message', message => {

	if (!message.content.startsWith(config.prefix)) return;
	if(message.channel.id === '582613034434822164' && message.content.startsWith('-verify ')){
		const uid = message.content.replace('-verify ', '');
		const userVer = message.guild.members.find('id', uid);
		if(userVer.roles.find('id','582610398151442447')){
			userVer.removeRole('582610398151442447').catch(err => {
			});
			userVer.createDM().then(createdDM =>{
				createdDM.send('Removed the Verified Role <:Afterfall:648901508838064138>');
			});
		}else{
			userVer.addRole('582610398151442447').catch(err => {
			});
			userVer.createDM().then(createdDM =>{
				createdDM.send('Added the Verified Role <:Afterfall:648901508838064138>');
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
});

client.login(config.token);
