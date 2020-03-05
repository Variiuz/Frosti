const { ShardingManager } = require('discord.js');
const config = require('./BotConfig.json');
const manager = new ShardingManager('./bot.js', { token: config.token});

manager.spawn();
manager.on('launch', shard => console.log(`Launched shard with id ${shard.id}`));
