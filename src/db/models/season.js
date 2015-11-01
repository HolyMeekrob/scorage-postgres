import baseModel from './baseModel';
import team from './team';
import seasonParticipant from './seasonParticipant';
import { deepFreeze } from '../../util';

export default (() => {
	const schema = deepFreeze({
		name: 'season',
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
			league_id: {
				type: 'number',
				required: false,
				canCreate: true,
				canUpdate: true
			}
		}
	});

	const getTeams = (seasonId) => {
		return base.getComplex(
			[team.getSchema(), seasonParticipant.getSchema()],
			`${team.getTableName()}.*`,
			[['id', 'team_id']],
			[[`${seasonParticipant.getTableName()}.season_id`, seasonId]]
		);
	};

	const addTeam = (teamId, seasonId) => {
		return seasonParticipant.addTeamToSeason(teamId, seasonId)
			.then(() => Promise.resolve(base.getById(seasonId)));
	};

	const removeTeam = (teamId, seasonId) => {
		return seasonParticipant.removeTeamFromSeason(teamId, seasonId)
			.then(() => Promise.resolve(base.getById(teamId)));
	};

	const base = baseModel(schema);

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		create: base.create,
		get: base.get,
		getById: base.getById,
		getTeams,
		update: base.update,
		updateById: base.updateById,
		addTeam,
		removeTeam
	});
})();
