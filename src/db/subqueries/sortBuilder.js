import util from '../../util';

export default (() => {
	const { any, isNil } = util;

	const checkKeys = (keys) => {
		if (isNil(keys)) {
			return true;
		}

		if (!Array.isArray(keys)) {
			throw new Error('Sort keys must be an array');
		}

		const nonStrings = keys.filter((key) => typeof key !== 'string');
		if (any(nonStrings)) {
			throw new Error('Sort keys must be strings');
		}

		return true;
	};

	const getSortStr = (keys) => {
		if (isNil(keys) || !any(keys)) {
			return '';
		}

		return ` ORDER BY ${keys.join(', ')}`;
	};

	const getSort = (keys) => {
		checkKeys(keys);
		return getSortStr(keys);
	};

	return Object.freeze({
		getSort
	});
})();
