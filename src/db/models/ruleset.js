import baseModel from './baseModel';
import { deepFreeze } from '../../util';

export default (() => {
	const schema = deepFreeze({
		name: 'ruleset',
		canDelete: 'false',
		columns: {
			id: {
				type: 'number',
				required: false,
				canCreate: false,
				canUpdate: false
			},
			game_id: {
				type: 'number',
				required: true,
				canCreate: true,
				canUpdate: false
			},
			name: {
				type: 'text',
				required: true,
				canCreate: true,
				canUpdate: true
			}
		}
	});

	const base = baseModel(schema);

	const getByGameId = (gameId) => {
		return base.get(undefined, [['game_id', gameId]]);
	};

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		create: base.create,
		get: base.get,
		getById: base.getById,
		getByGameId,
		update: base.update,
		updateById: base.updateById
	});
})();
