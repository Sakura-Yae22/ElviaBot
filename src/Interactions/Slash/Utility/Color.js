import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'color',
	description: 'Get information about a color.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'color',
		description: 'Hexadecimal/RGB code of the color or random to get a random color.',
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	dm_permission: true
};
