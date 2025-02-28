import { ApplicationCommandType, ApplicationCommandOptionType, ChannelType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'slowmode',
	description: 'Manage slowmode.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'set',
		description: 'Set slowmode duration.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'duration',
			description: 'Duration of the slowmode. (Example: 2 hours)',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'channel',
			description: 'Channel to set slowmode in. (Defaults to current channel)',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
			required: false
		}]
	}, {
		name: 'off',
		description: 'Turn off slowmode.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'channel',
			description: 'Channel to turn slowmode off. (Defaults to current channel)',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
			required: false
		}]
	}],
	default_member_permissions: new PermissionsBitField(['ManageChannels']).bitfield.toString(),
	dm_permission: false
};
