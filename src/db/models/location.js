import baseModel from './baseModel';
import { deepFreeze } from '../../util';

export default (() => {
	const schema = deepFreeze({
		name: 'location',
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
		}
	});

	const base = baseModel(schema);

	return Object.freeze({
		getSchema: base.schema,
		getTableName: base.getTableName,
		create: base.create,
		get: base.get,
		getById: base.getById,
		update: base.update,
		updateById: base.updateById
	});
})();
