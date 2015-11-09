import fieldsBuilder from '../subqueries/fieldsBuilder';
import conditionsBuilder from '../subqueries/conditionsBuilder';
import sourcesBuilder from '../subqueries/sourcesBuilder';
import sortBuilder from '../subqueries/sortBuilder';

import queryBuilderUtil from './queryBuilderUtil';
import util from '../../util';

export default (() => {
	const { isTableNameValid } = queryBuilderUtil;
	const { any } = util;

	const select = (schemas, fields, joins, conditions, sort) => {
		schemas = Array.isArray(schemas) ? schemas : [schemas];

		const invalidTables = schemas.filter((schema) => {
			return !isTableNameValid(schema);
		}).map((schema) => schema.name);

		if (any(invalidTables)) {
			throw new Error(`Invalid tables: ${invalidTables.map.join(', ')}`);
		}

		const fieldsStr = fieldsBuilder.getFields(fields);
		const sourcesStr = sourcesBuilder.getSources(schemas, joins);
		const conditionsStr = conditionsBuilder.getConditions(conditions);
		const sortStr = sortBuilder.getSort(sort);

		return `SELECT ${fieldsStr} FROM ${sourcesStr}${conditionsStr}${sortStr}`;
	};

	return Object.freeze({
		select
	});
})();
