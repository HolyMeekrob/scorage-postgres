import util from '../../util';

export default (() => {
	const { isNil, difference, intersection } = util;

	const isTableNameValid = (schema) => {
		return !isNil(schema) && (typeof schema.name === 'string');
	};

	const isTypeMatch = (value, type) => {
		if (isNil(value)) {
			return true;
		}

		if (type === 'text') {
			return typeof value === 'string';
		}

		if (type === 'unique') {
			const uuidRegex =
				/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;
			return (typeof value === 'string') && uuidRegex.test(value);
		}

		if (type === 'number') {
			return typeof value === 'number';
		}

		if (type === 'boolean') {
			return typeof value === 'boolean';
		}

		if (type === 'json') {
			return value !== null && typeof value === 'object';
		}

		throw new Error(`${type} is not a valid type`);
	};

	const getFormattedValue = (value, type) => {
		if (isNil(value)) {
			return 'NULL';
		}

		if (type === 'text') {
			return `'${value.replace('\'', '\'\'')}'`;
		}

		if (type === 'unique') {
			return value;
		}

		if (type === 'number') {
			return value;
		}

		if (type === 'boolean') {
			return value ? 'TRUE' : 'FALSE';
		}

		if (type === 'json') {
			return JSON.stringify(value);
		}

		throw new Error(`${type} is not a valid type`);
	};

	const getMisusedColumns = (schema, values, flag) => {
		const schemaColumns = Object.keys(schema.columns);
		const valueColumns = Object.keys(values);

		const cannotUseColumns = schemaColumns.filter((col) => {
			return !schema.columns[col][flag];
		});

		return intersection(cannotUseColumns, valueColumns);
	};

	const getInvalidColumns = (schema, values) => {
		const schemaColumns = Object.keys(schema.columns);
		const valueColumns = Object.keys(values);
		return difference(valueColumns, schemaColumns);
	};

	const getTypeMismatchedColumns = (schema, values) => {
		const valueColumns = Object.keys(values);
		return valueColumns.filter((col) => {
			return !isTypeMatch(values[col], schema.columns[col].type);
		});
	};

	const removeExtraWhitespace = (query) => {
		return query.trim().replace(/\t/g, '');
	};

	return Object.freeze({
		isTableNameValid,
		isTypeMatch,
		getFormattedValue,
		getTypeMismatchedColumns,
		getInvalidColumns,
		getMisusedColumns,
		removeExtraWhitespace
	});
})();
