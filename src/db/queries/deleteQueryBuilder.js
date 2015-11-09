import conditionsBuilder from '../subqueries/conditionsBuilder';
import queryBuilderUtil from './queryBuilderUtil';

export default (() => {
	const { isTableNameValid } = queryBuilderUtil;
	const del = (schema, conditions) => {
		if (!isTableNameValid(schema)) {
			throw new Error('Valid table name required');
		}

		if (!schema.canDelete) {
			throw new Error(`Table ${schema.name} does not allow deletes`);
		}

		const conditionsStr = conditionsBuilder.getConditions(conditions);

		return `DELETE FROM ${schema.name}${conditionsStr} RETURNING *`;
	};

	return Object.freeze({
		del
	});
})();
