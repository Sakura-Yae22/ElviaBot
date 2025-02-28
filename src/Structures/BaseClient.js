import { Client, Partials, PermissionsBitField } from 'discord.js';
import { ActivityType, GatewayIntentBits } from 'discord-api-types/v10';
import { Collection } from '@discordjs/collection';
import { PrismaClient } from '@prisma/client';
import { Logger } from '@rygent/logger';
import Util from './Util.js';
import semver from 'semver';
const prisma = new PrismaClient();

export default class BaseClient extends Client {

	constructor(options = {}) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			],
			partials: [
				Partials.Channel
			],
			allowedMentions: {
				parse: ['users', 'roles'],
				repliedUser: false
			},
			presence: {
				activities: [{
					name: '/help',
					type: ActivityType.Listening
				}]
			}
		});
		this.logger = new Logger(this);
		this.validate(options);

		this.interactions = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.cooldown = new Collection();

		this.utils = new Util(this);
	}

	async validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');
		if (semver.lt(process.versions.node, '16.9.0')) throw new Error('This client requires Node.JS v16.9.0 or higher.');
		this.debug = options.debug;

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the Client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.owners.length) throw new Error('You must pass a list of owner(s) for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owner(s) should be a type of Array<String>.');
		this.owners = options.owners;

		if (!options.defaultPermissions.length) throw new Error('You must pass default permission(s) for the Client.');
		if (!Array.isArray(options.defaultPermissions)) throw new TypeError('Permission(s) should be a type of Array<String>.');
		this.defaultPermissions = new PermissionsBitField(options.defaultPermissions).freeze();

		await import('../Utils/Validation.js');
	}

	async start(token = this.token) {
		await this.utils.loadInteractions();
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		await prisma.$connect();
		super.login(token);
	}

}
