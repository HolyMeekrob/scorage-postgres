import util from '../../util';
import queryBuilderUtil from '../queries/queryBuilderUtil';

export default (() => {
	const { any, isNil, includes } = util;
	const { removeExtraWhitespace } = queryBuilderUtil;

	const checkJoins = (joins) => {
		if (!Array.isArray(joins)) {
			throw new Error('Sources must be an array');
		}

		return true;
	};

	const checkLengths = (schemas, joins) => {
		if (schemas.length !== (joins.length + 1)) {
			throw new Error('Joins must be one less than total table count');
		}

		return true;
	};

	const checkJoinValues = (schemas, joins) => {
		const invalidJoins = joins.filter((join, i) => {
			return !includes(Object.keys(schemas[i].columns), join[0])
				|| !includes(Object.keys(schemas[i + 1].columns), join[1]);
		});

		if (any(invalidJoins)) {
			throw new Error('Joined columns must exist in schemas');
		}

		return true;
	};

	const getSourcesSubquery = (schemas, joins) => {
		return joins.reduce((prev, curr, i) => {
			return removeExtraWhitespace(`\
				${prev} INNER JOIN ${schemas[i + 1].name} ON \
				${schemas[i].name}.${curr[0]} = ${schemas[i + 1].name}.${curr[1]}`
			);
		}, schemas[0].name);
	};

	const getSources = (schemas, joins) => {
		joins = isNil(joins) ? [] : joins;

		checkJoins(joins);
		checkLengths(schemas, joins);
		checkJoinValues(schemas, joins);

		return getSourcesSubquery(schemas, joins);
	};

	return Object.freeze({
		getSources
	});
})();
