import baseModel from './baseModel';
import { deepFreeze } from '../../util';

export default (() => {
	const schema = deepFreeze({
		name: 'season_participant',
		canDelete: true,
		columns: {
			team_id: {
				type: 'number',
				required: true,
				canCreate: true,
				canUpdate: false
			},
			season_id: {
				type: 'number',
				required: true,
				canCreate: true,
				canUpdate: false
			}
		}
	});

	const base = baseModel(schema);

	const addTeamToSeason = (teamId, seasonId) => {
		return base.create({
			team_id: teamId,
			season_id: seasonId
		});
	};

	const removeTeamFromSeason = (teamId, seasonId) => {
		return base.del([['team_id', teamId], ['season_id', seasonId]]);
	};

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		create: base.create,
		addTeamToSeason,
		removeTeamFromSeason
	});
})();
