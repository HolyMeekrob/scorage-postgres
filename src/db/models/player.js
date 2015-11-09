import baseModel from './baseModel';
import util from '../../util';

export default (() => {
	const { deepFreeze } = util;

	const schema = deepFreeze({
		name: 'player',
		canDelete: false,
		columns: {
			id: {
				type: 'number',
				required: false,
				canCreate: false,
				canUpdate: false
			},
			first_name: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			middle_name: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			last_name: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			nickname: {
				type: 'text',
				required: true,
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
			position: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
			},
			number: {
				type: 'text',
				required: false,
				canCreate: true,
				canUpdate: true
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
		updateById: base.updateById
	});
})();
