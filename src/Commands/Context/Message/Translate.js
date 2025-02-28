import Command from '../../../Structures/Interaction.js';
import translate from '@iamtraction/google-translate';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['Translate']
		});
	}

	async run(interaction) {
		const message = interaction.options.getMessage('message', true);
		await interaction.deferReply({ ephemeral: true });

		if (!message.content) return interaction.editReply({ content: 'There is no text in this message.' });

		const locale = !['zh-CN', 'zh-TW'].includes(interaction.locale) ? new Intl.Locale(interaction.locale).language : interaction.locale;
		const translated = await translate(message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ''), { to: locale });

		return interaction.editReply({ content: translated.text });
	}

}
