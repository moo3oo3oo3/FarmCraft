class Embed {
	constructor() {
		this.type = 'rich'
	}
}

function create() {
	
	const embed = {
		title: 'title',
		type: 'rich',
		description: 'description',
		url: '',
		timestamp: '',
		//color: ,
		footer: {},
		image: {},
		thumbnail: {
			url: 'https://github.com/MatrexsVigil/harvestcraft/blob/master/src/main/resources/assets/harvestcraft/textures/items/applepieitem.png?raw=true',
			height: 200,
			width: 200,
		},
		video: {},
		provider: {},
		author: {},
		fields: [
			{
				name: 'some field name',
				value: 'field value',
				inline: true,
			}
		],
	}
	
	return embed;
}

module.exports = Object.assign( { create });