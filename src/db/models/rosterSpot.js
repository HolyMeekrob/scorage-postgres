import baseModel from './baseModel';
import { deepFreeze } from '../../util';

export default (() => {
	const schema = deepFreeze({
		name: 'roster_spot',
		canDelete: true,
		columns: {
			player_id: {
				type: 'number',
				required: true,
				canCreate: true,
				canUpdate: false
			},
			team_id: {
				type: 'number',
				required: true,
				canCreate: true,
				canUpdate: false
			}
		}
	});

	const base = baseModel(schema);

	const addPlayerToTeam = (playerId, teamId) => {
		return base.create({
			player_id: playerId,
			team_id: teamId
		});
	};

	const removePlayerFromTeam = (playerId, teamId) => {
		return base.del([['team_id', teamId], ['player_id', playerId]]);
	};

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		addPlayerToTeam,
		removePlayerFromTeam
	});
})();
