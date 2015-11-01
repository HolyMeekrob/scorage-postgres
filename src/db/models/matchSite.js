import baseModel from './baseModel';
import { deepFreeze } from '../../util';

export default (() => {
	const schema = deepFreeze({
		name: 'match_site',
		canDelete: true,
		columns: {
			id: {
				type: 'number',
				required: false,
				canCreate: false,
				canUpdate: false
			},
			location_id: {
				type: 'number',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			start_time: {
				type: 'timestamp',
				required: false,
				canCreate: true,
				canUpdate: false
			}
		}
	});

	const base = baseModel(schema);

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		create: base.create,
		get: base.get,
		getById: base.getById,
		update: base.update,
		updateById: base.updateById,
		deleteById: base.deleteById
	});
})();
