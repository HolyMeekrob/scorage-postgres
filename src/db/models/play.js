import baseModel from './baseModel';
import { deepFreeze } from '../../util';

export default (() => {
	const schema = deepFreeze({
		name: 'play',
		canDelete: true,
		columns: {
			id: {
				type: 'number',
				required: false,
				canCreate: false,
				canUpdate: false
			},
			match_id: {
				type: 'number',
				required: true,
				canCreate: true,
				canUpdate: false
			},
			details: {
				type: 'json',
				required: true,
				canCreate: true,
				canUpdate: true
			}
		}
	});

	const base = baseModel(schema);

	const getPlaysByMatchId = (matchId) => {
		return base.getComplex(schema, ['details'], undefined,
			[['match_id', matchId]], ['id']);
	};

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		create: base.create,
		get: base.get,
		getById: base.getById,
		getPlaysByMatchId,
		update: base.update,
		updateById: base.updateById,
		deleteById: base.deleteById
	});
})();
