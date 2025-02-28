import Command from '../../../../Structures/Interaction.js';
import { owofy } from '../../../../Modules/TextGenerator.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'owofy'],
			description: 'Transform your text into owo and uwu.'
		});
	}

	async run(interaction) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: owofy(text) });
	}

}
