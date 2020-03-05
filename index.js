import { ShardingManager } from 'discord.js';
import { token as _token } from './CONFIG.json';
const manager = new ShardingManager('./bot.js', { token: _token});

manager.spawn();
manager.on('launch', shard => console.log(`Launched shard with id ${shard.id}`));
