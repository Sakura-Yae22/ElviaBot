import Event from '../../Structures/Event.js';
import { isRestrictedChannel } from '../../Structures/Util.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'interactionCreate',
			once: false
		});
	}

	async run(interaction) {
		if (!interaction.isAutocomplete()) return;

		if (interaction.commandName === 'nsfw') {
			const focused = interaction.options.getFocused();
			if (!isRestrictedChannel(interaction.channel)) return interaction.respond([]);

			const raw = require('../../Assets/json/nsfw.json');
			const choices = raw.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));

			if (focused.length) {
				return interaction.respond(choices.map(({ name, value }) => ({ name, value })));
			} else {
				return interaction.respond(choices.filter(({ hoisted }) => hoisted).map(({ name, value }) => ({ name, value })));
			}
		}

		if (interaction.commandName === 'translate') {
			const focused = interaction.options.getFocused(true);

			const raw = require('../../Assets/json/languages.json');
			const choices = raw.filter(({ name }) => name.toLowerCase().includes(focused.value.toLowerCase()));

			if (focused.value.length) {
				return interaction.respond(choices.map(({ name, value }) => ({ name, value })).slice(0, 25));
			} else {
				return interaction.respond(choices.filter(({ hoisted }) => hoisted).map(({ name, value }) => ({ name, value })));
			}
		}
	}

}
