import util from '../../util';
import queryBuilderUtil from './queryBuilderUtil';

export default (() => {
	const { isNil, difference, any } = util;
	const {
		isTableNameValid,
		getFormattedValue,
		getMisusedColumns,
		getInvalidColumns,
		getTypeMismatchedColumns,
		removeExtraWhitespace
	} = queryBuilderUtil;

	const checkValuesForInsert = (schema, values) => {
		const schemaColumns = Object.keys(schema.columns);
		const valueColumns = Object.keys(values);

		const requiredColumns = schemaColumns.filter((col) => {
			return schema.columns[col].required;
		});

		const missingColumns = difference(requiredColumns, valueColumns);
		if (any(missingColumns)) {
			throw new Error(`Columns [${missingColumns.join(', ')}] are required`);
		}

		const cannotInsertColumns = getMisusedColumns(schema, values, 'canCreate');
		if (any(cannotInsertColumns)) {
			throw new Error(
				`Columns [${cannotInsertColumns.join(', ')}] cannot be inserted`);
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

	const insert = (schema, values) => {
		if (!isTableNameValid(schema)) {
			throw new Error('Valid table name required');
		}

		if (isNil(values) || typeof values !== 'object') {
			throw new Error('Insert values must be an object');
		}

		checkValuesForInsert(schema, values);

		const updateCols = Object.keys(values);

		const colVals = updateCols.reduce((arr, col) => {
			arr.push([col, getFormattedValue(
				values[col], schema.columns[col].type)]);
			return arr;
		}, []);

		const queryCols = colVals.map((both) => both[0]).join(', ');
		const queryVals = colVals.map((both) => both[1]).join(', ');

		return removeExtraWhitespace(
			`INSERT INTO ${schema.name} (${queryCols}) VALUES (${queryVals}) \
			RETURNING *`
		);
	};

	return Object.freeze({
		insert
	});
})();
