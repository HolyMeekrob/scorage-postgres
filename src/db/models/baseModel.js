import db from '../client';
import queryBuilder from '../queries/queryBuilder';
import { single } from '../../util';

export default (schema) => {
	const makeSingle = (promise) => {
		return promise.then((rows) => {
			return Promise.resolve(single(rows));
		});
	};

	const getTableName = () => {
		return schema.name;
	};

	const getSchema = () => {
		return schema;
	};

	const runQuery = (query) => {
		return db.makeRequest(query)
			.then((result) => {
				return Promise.resolve(result.rows);
			});
	};

	const create = (vals) => {
		return makeSingle(runQuery(queryBuilder.insert(schema, vals)));
	};

	const del = (conditions) => {
		return runQuery(queryBuilder.del(schema, conditions));
	};

	const deleteById = (id) => {
		return makeSingle(del([['id', id]]));
	};

	const get = (fields, conditions) => {
		return runQuery(queryBuilder.select(schema, fields, [], conditions));
	};

	const getById = (id, fields) => {
		return makeSingle(get(fields, [['id', id]]));
	};

	const getComplex = (schemas, fields, joins, conditions, sorts) => {
		return runQuery(queryBuilder.select(
			schemas, fields, joins, conditions, sorts));
	};

	const update = (vals, conditions) => {
		return runQuery(queryBuilder.update(schema, vals, conditions));
	};

	const updateById = (id, vals) => {
		return makeSingle(update(vals, [['id', id]]));
	};

	return Object.freeze({
		getSchema,
		getTableName,
		create,
		del,
		deleteById,
		get,
		getById,
		getComplex,
		runQuery,
		update,
		updateById
	});
};
