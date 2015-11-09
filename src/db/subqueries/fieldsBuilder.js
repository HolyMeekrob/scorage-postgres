import util from '../../util';

export default (() => {
	const { any, isNil } = util;

	const checkFields = (fieldsToCheck) => {
		if (isNil(fieldsToCheck)) {
			return true;
		}

		if (!Array.isArray(fieldsToCheck)) {
			throw new Error('Query fields must be a string or an array');
		}

		return true;
	};

	const getFieldsString = (fields) => {
		if (isNil(fields) || !any(fields)) {
			return '*';
		}

		return fields.join(', ');
	};

	const getFields = (fields) => {
		if (typeof fields === 'string') {
			return fields;
		}

		checkFields(fields);
		const fieldArray = [].concat(fields).filter((field) => !isNil(field));
		return getFieldsString(fieldArray);
	};

	return Object.freeze({
		getFields
	});
})();
