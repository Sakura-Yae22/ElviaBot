const Interaction = require('../../../../Structures/Interaction.js');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { Color } = require('../../../../Utils/Configuration.js');
const Kitsu = require('kitsu');
const api = new Kitsu();
const moment = require('moment');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'anime',
			description: 'Search for an Anime on MyAnimeList.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);
		await interaction.deferReply();

		const { data } = await api.get('anime', { params: { filter: { text: search } } });
		if (data.length === 0) return await interaction.editReply({ content: 'Nothing found for this search.' });

		const select = new MessageActionRow()
			.addComponents(new MessageSelectMenu()
				.setCustomId('data_menu')
				.setPlaceholder('Select an anime!')
				.addOptions(data.map(res => ({
					label: res.titles.en_jp || res.titles.en || res.titles.en_us,
					description: res.description?.trimString(97),
					value: res.slug
				}))));

		await interaction.editReply({ content: `I found **${data.length}** possible matches, please select one of the following:`, components: [select] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 60000 });

		collector.on('collect', async (i) => {
			await i.deferUpdate();

			const [choices] = i.values;
			const result = data.find(x => x.slug === choices);

			const button = new MessageActionRow()
				.addComponents(new MessageButton()
					.setStyle('LINK')
					.setLabel('Open in Browser')
					.setURL(`https://kitsu.io/anime/${result.slug}`));

			const embed = new MessageEmbed()
				.setColor(Color.DEFAULT)
				.setAuthor({ name: 'Kitsu', iconURL: 'https://kitsu.io/kitsu-256-d4c4633df2c4745352100a4f0a7f5f9e.png', url: 'https://kitsu.io' })
				.setTitle(result.titles.en_jp || result.titles.en || result.titles.en_us)
				.setThumbnail(result.posterImage?.original)
				.addField('__Detail__', [
					`***English:*** ${result.titles.en ? result.titles.en : result.titles.en_jp}`,
					`***Japanese:*** ${result.titles.ja_jp ? result.titles.ja_jp : '`N/A`'}`,
					`***Synonyms:*** ${result.abbreviatedTitles.length > 0 ? result.abbreviatedTitles.join(', ') : '`N/A`'}`,
					`***Score:*** ${result.averageRating ? result.averageRating : '`N/A`'}`,
					`***Rating:*** ${result.ageRating ? result.ageRating : '`N/A`'}${result.ageRatingGuide ? ` - ${result.ageRatingGuide}` : ''}`,
					`***Type:*** ${result.showType ? `${result.showType !== 'TV' ? result.showType.toProperCase() : result.showType}` : '`N/A`'}`,
					`***Episodes:*** ${result.episodeCount ? result.episodeCount : '`N/A`'}`,
					`***Length:*** ${result.episodeLength ? `${result.episodeLength} minutes` : '`N/A`'}`,
					`***Status:*** ${result.status.toProperCase()}`,
					`***Aired:*** ${result.startDate ? `${result.showType === 'movie' ? moment(result.startDate).format('MMM D, YYYY') : `${moment(result.startDate).format('MMM D, YYYY')} to ${result.endDate ? moment(result.endDate).format('MMM D, YYYY') : '?'}`}` : '`N/A`'}`
				].join('\n'))
				.setImage(result.coverImage?.small)
				.setFooter({ text: 'Powered by Kitsu', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			if (result.synopsis) {
				embed.setDescription(result.synopsis);
			}

			return i.editReply({ content: '\u200B', embeds: [embed], components: [button] });
		});

		collector.on('end', (collected) => {
			if (collected.size === 0) return interaction.deleteReply();
		});
	}

};