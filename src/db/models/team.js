import baseModel from './baseModel';
import player from './player';
import roster from './rosterSpot';
import { deepFreeze } from '../../util';

export default (() => {
	const schema = deepFreeze({
		name: 'team',
		canDelete: false,
		columns: {
			id: {
				type: 'number',
				required: false,
				canCreate: false,
				canUpdate: false
			},
			name: {
				type: 'text',
				required: true,
				canCreate: true,
				canUpdate: true
			},
			coach_id: {
				type: 'number',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			email: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			phone: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			address: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			description: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			website: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			home_location_id: {
				type: 'number',
				required: false,
				canCreate: true,
				canUpdate: true
			}
		}
	});

	const base = baseModel(schema);

	const getRoster = (teamId) => {
		return base.getComplex(
			[player.getSchema(), roster.getSchema()],
			`${player.getTableName()}.*`,
			[['id', 'player_id']],
			[[`${roster.getTableName()}.team_id`, teamId]]
		);
	};

	const addPlayer = (playerId, teamId) => {
		return roster.addPlayerToTeam(playerId, teamId)
			.then(() => Promise.resolve(getRoster(teamId)));
	};

	const removePlayer = (playerId, teamId) => {
		return roster.removePlayerFromTeam(teamId, playerId)
			.then(() => Promise.resolve(getRoster(teamId)));
	};

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		create: base.create,
		get: base.get,
		getById: base.getById,
		getRoster,
		update: base.update,
		updateById: base.updateById,
		addPlayer,
		removePlayer
	});
})();
