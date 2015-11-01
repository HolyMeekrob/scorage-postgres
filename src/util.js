export default (() => {
	const isNil = (obj) => {
		return obj === undefined || obj === null;
	};

	const single = (arr) => {
		if (isNil(arr)) {
			throw new Error('Array is required');
		}

		if (!Array.isArray(arr)) {
			throw new Error('Argument must be an array');
		}

		if (arr.length > 1) {
			throw new Error('');
		}

		if (!any(arr)) {
			return {};
		}

		return arr[0];
	};

	const isIterable = (obj) => {
		if (isNil(obj)) {
			return false;
		}

		return obj[Symbol.iterator] !== undefined;
	};

	const includes = (source, val) => {
		if (!isIterable(source)) {
			throw new ('Iterable is required');
		}

		const arr = Array.from(source);
		return any(arr.filter((elem) => {
			return elem === val;
		}));
	};

	const any = (iter) => {
		if (!isIterable(iter)) {
			throw new Error('Must be an iterator');
		}

		return !iter[Symbol.iterator]().next().done;
	};

	const difference = (a, b) => {
		if (!isIterable(a) || !isIterable(b)) {
			throw new Error('Iterables required');
		}

		return Array.from(a).filter((elem) => !includes(b, elem));
	};

	const intersection = (a, b) => {
		if (!isIterable(a) || !isIterable(b)) {
			throw new Error('Iterables required');
		}

		return Array.from(a).filter((elem) => includes(b, elem));
	};

	const deepFreeze = (obj) => {
		const propNames = Object.getOwnPropertyNames(obj);

		propNames.filter((propName) => {
			const prop = obj[propName];
			return (typeof prop === 'object' && !Object.isFrozen(prop));
		}).forEach((propName) => deepFreeze(obj[propName]));

		return Object.freeze(obj);
	};

	return Object.freeze({
		isNil,
		single,
		isIterable,
		includes,
		any,
		difference,
		intersection,
		deepFreeze
	});
})();
