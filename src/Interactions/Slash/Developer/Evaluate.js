import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'evaluate',
	description: 'Evaluates any JavaScript code.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'depth',
		description: 'The inspection depth to apply.',
		type: ApplicationCommandOptionType.Integer,
		required: false
	}, {
		name: 'async',
		description: 'Whether this code should be evaluated asynchronously.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}, {
		name: 'ephemeral',
		description: 'Whether the message should be visibled ephemerally.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}],
	default_member_permissions: 0,
	dm_permission: false
};
