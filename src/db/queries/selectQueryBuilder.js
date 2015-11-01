import { getFields } from '../subqueries/fieldsBuilder';
import { getConditions } from '../subqueries/conditionsBuilder';
import { getSources } from '../subqueries/sourcesBuilder';
import { getSort } from '../subqueries/sortBuilder';

import { isTableNameValid } from './queryBuilderUtil';
import { any } from '../../util';

export default (() => {
	const select = (schemas, fields, joins, conditions, sort) => {
		schemas = Array.isArray(schemas) ? schemas : [schemas];
		const invalidTables = schemas.filter((schema) => {
			return !isTableNameValid(schema);
		}).map((schema) => schema.name);
		if (any(invalidTables)) {
			throw new Error(`Invalid tables: ${invalidTables.map.join(', ')}`);
		}

		const fieldsStr = getFields(fields);
		const sourcesStr = getSources(schemas, joins);
		const conditionsStr = getConditions(conditions);
		const sortStr = getSort(sort);

		return `SELECT ${fieldsStr} FROM ${sourcesStr}${conditionsStr}${sortStr}`;
	};

	return Object.freeze({
		select
	});
})();
