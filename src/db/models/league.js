import baseModel from './baseModel';
import season from './season';
import util from '../../util';

export default (() => {
	const { deepFreeze } = util;

	const schema = deepFreeze({
		name: 'league',
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
			commissioner_id: {
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
			}
		}
	});

	const base = baseModel(schema);

	const getSeasons = (leagueId) => {
		return season.get(undefined, [['league_id', leagueId]]);
	};

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		create: base.create,
		get: base.get,
		getById: base.getById,
		getSeasons,
		update: base.update,
		updateById: base.updateById
	});
})();
