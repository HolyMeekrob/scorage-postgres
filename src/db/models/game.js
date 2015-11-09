import baseModel from './baseModel';
import util from '../../util';

export default (() => {
	const { deepFreeze } = util;

	const schema = deepFreeze({
		name: 'game',
		canDelete: false,
		columns: {
			id: {
				type: 'number',
				required: false,
				canCreate: false,
				canUpdate: false
			},
			formatter_id: {
				type: 'unique',
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

	const getByFormatterId = (formatterId) => {
		return base.get(undefined, [['formatter_id', formatterId]]);
	};

	return Object.freeze({
		getSchema: base.getSchema,
		getTableName: base.getTableName,
		create: base.create,
		get: base.get,
		getById: base.getById,
		getByFormatterId,
		update: base.update,
		updateById: base.updateById
	});
})();
