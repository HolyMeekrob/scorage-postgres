import util from '../../util';
import conditionsBuilder from '../subqueries/conditionsBuilder';
import queryBuilderUtil from './queryBuilderUtil';

export default (() => {
	const { any, isNil } = util;
	const {
		isTableNameValid,
		getMisusedColumns,
		getInvalidColumns,
		getTypeMismatchedColumns,
		getFormattedValue,
		removeExtraWhitespace
	} = queryBuilderUtil;

	const checkValuesForUpdate = (schema, values) => {
		if (!any(Object.keys(values))) {
			throw new Error('Must update at least one value');
		}

		const readonlyColumns = getMisusedColumns(schema, values, 'canUpdate');
		if (any(readonlyColumns)) {
			throw new Error(
				`Columns [${readonlyColumns.join(', ')} are readonly`);
		}

		const invalidColumns = getInvalidColumns(schema, values);
		if (any(invalidColumns)) {
			throw new Error(`Columns [${invalidColumns.join(', ')}] are invalid`);
		}

		const typeMismatches = getTypeMismatchedColumns(schema, values);
		if (any(typeMismatches)) {
			throw new Error(
				`Columns [${typeMismatches.join(', ')}] are the wrong type`);
		}
	};

	const update = (schema, values, conditions) => {
		if (!isTableNameValid(schema)) {
			throw new Error('Valid table name required');
		}

		if (isNil(values) || typeof values !== 'object') {
			throw new Error('Update values must be an object');
		}

		checkValuesForUpdate(schema, values);

		const querySets = Object.keys(values).map((col) => {
			const value = getFormattedValue(values[col], schema.columns[col].type);
			return `${col} = ${value}`;
		});

		const conditionsStr = conditionsBuilder.getConditions(conditions);

		return removeExtraWhitespace(`UPDATE ${schema.name} SET ${querySets}\
			${conditionsStr} RETURNING *`
		);
	};

	return Object.freeze({
		update
	});
})();
