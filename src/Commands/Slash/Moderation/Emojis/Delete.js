import Command from '../../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { parseEmoji } from 'discord.js';
import { nanoid } from 'nanoid';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['emojis', 'delete'],
			description: 'Delete a server emoji.',
			memberPermissions: ['ManageEmojisAndStickers'],
			clientPermissions: ['ManageEmojisAndStickers']
		});
	}

	async run(interaction) {
		const emoji = interaction.options.getString('emoji', true);

		const parse = parseEmoji(emoji);

		const emojis = await interaction.guild.emojis.cache.get(parse.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const [cancelId, deleteId] = ['cancel', 'delete'].map(type => `${type}-${nanoid()}`);
		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setCustomId(deleteId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Delete'));

		const reply = await interaction.reply({ content: `Are you sure that you want to delete the \`:${emojis.name}:\` ${emojis} emoji?`, components: [button] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60_000 });

		collector.on('ignore', (i) => i.deferUpdate());
		collector.on('collect', async (i) => {
			switch (i.customId) {
				case cancelId:
					await collector.stop();
					return i.update({ content: 'Cancelation of the deletion of the emoji.', components: [] });
				case deleteId:
					await emojis.delete();
					return i.update({ content: `Emoji \`:${emojis.name}:\` was successfully removed.`, components: [] });
			}
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}

}
