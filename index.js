console.log('FarmCraft activated!');

require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const guildID = '343936988803629067'; //supa secret call
//const guildID = '211731441724293130'; //sodium chloride guild
//const guildID = '211729024165085184'; //Harvard
const fs = require('fs');

const Example = require('./js/example.js');

const getApp = (guildID) => {  //Get guild application
	const app = client.api.applications(client.user.id);
	if (guildID) { app.guilds(guildID) }
	return app
}

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({ activity: { name: 'WIP', type: 'PLAYING' } });
	
	//Get slash commands on test guild
	const commands = await getApp(guildID).commands.get();
	console.log(commands);
	
	//Almanac slash command
	await getApp(guildID).commands.post({
		data: {
			name: 'almanac',
			description: 'Provides information.',
			options: [
				{
					name: 'query',
					description: 'The thing you want more information on.',
					required: true,
					type: 3, //String
				},
			],
		},
	});
  
	//shutdown slash command
	await getApp(guildID).commands.post({
		data: {
			name: 'shutdown',
			description: 'Turns off the bot.',
		},
		
	});
});

//Slash command interaction event
client.ws.on('INTERACTION_CREATE', async (interaction) => {
  const { name, options } = interaction.data;
  
  const command = name.toLowerCase();
  
  
  
  switch(command) {
	  case 'almanac':
		let embed = almanac(options[0].value);
		reply(interaction, embed, true);
		break;
	  case 'shutdown':
		reply(interaction, ':farmer: You you next time :wave:', true);
		setTimeout(function(){
			shutdown();
		}, 5000);
		break;
  }
});


client.login(process.env.BOTTOKEN);


//Reply to interaction
function reply(interaction, response, ephemeral) {
	let CallbackData = {
		content: response,
		flags: (ephemeral ? 64 : null),
	}
	
	//Check for embed
	if (typeof response === 'object') {
		CallbackData = {
			embeds: [response],
			//Uncomment when done testing
			//flags: (ephemeral ? 64 : null),
		}
	}
	
	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4, //Reply immediately
			data: CallbackData,
		},
	});
}


function readJSON(path) {
	let rawdata = fs.readFileSync(path);
	return JSON.parse(rawdata);
}


function writeJSON(path, json) {
	let data = JSON.stringify(json, null, 2);
	fs.writeFile(path, data, (err) => {
		if (err) throw err;
	});
}


async function getMessage(channelID, msgID) { //Return message object
	var msgObj = await client.channels.fetch(channelID)
		.then(channel => { 
			if(channel.deleted) { throw `Channel ${channelID} no longer exists!`; }
			return channel;
		})
		.then(channel => { return channel.messages.fetch(msgID)
			.then(msg => {
				if(msg.deleted) { throw `Message ${msgID} no longer exists!`; }
				return msg;
			});
		}).catch(error => {});
		
	if(msgObj) { return msgObj; }
	else { return null; }
}


function almanac(query) {
	const item = readJSON(`./items/${query}.json`);
	
	const embed = new Discord.MessageEmbed()
		.setTitle(item.name)
		.setDescription(item.description)
		.setThumbnail(`https://github.com/moo3oo3oo3/FarmCraft/blob/main/assets/items/${item.imageName}?raw=true`)
		.addFields(
			{ name: ':first_place: Min Lvl', value: item.level, inline: true },
			{ name: ':brown_square: Soil', value: item.soil, inline: true },
			{ name: ':alarm_clock: Growth Time', value: item.growthTime, inline: true },
			{ name: '\u200B', value: '\u200B'},
			{ name: ':shopping_cart: Vendor Price', value: `${item.vendor} :coin:`, inline: false },
		);
	
	return embed;
}


function shutdown() {
	console.log('Good Night');
	client.user.setPresence({ status: 'invisible' });
	client.destroy();
	process.kill(process.pid, 'SIGTERM') //Waits for processes to finish
}

//For scalability
module.exports = Object.assign({ /*Put functions to export here*/ }, Example);