import { getSources } from '../../../../../src/db/subqueries/sourcesBuilder';
import chai from 'chai';
chai.should();

describe('sourcesBuilder', () => {
	describe('#getSources()', () => {
		describe('when given a non-array schema', () => {
			it('should throw an error', () => {
				const schemas = { name: 'table1', columns: { col1: { type: 'text' } } };
				const joins = undefined;

				(() => getSources(schemas, joins)).should.throw(Error);
			});
		});
		describe('when given non-array joins', () => {
			it('should throw an error', () => {
				const schemas = [
					{ name: 'table', columns: { col: { type: 'text' } } }
				];
				const joins = 'not an array';

				(() => getSources(schemas, joins)).should.throw(Error);
			});
		});
		describe('when given more joins than schemas', () => {
			it('should throw an error', () => {
				const schemas = [
					{ name: 'table1', columns: { col1: { type: 'text' } } },
					{ name: 'table2', columns: { col2: { type: 'text' } } }
				];
				const joins = [['col1', 'col2'], ['col2', 'col3'], ['col3', 'col4']];

				(() => getSources(schemas, joins)).should.throw(Error);
			});
		});

		describe('when given the same number of joins as schemas', () => {
			it('should throw an error', () => {
				const schemas = [
					{ name: 'table1', columns: { col1: { type: 'text' } } },
					{ name: 'table2', columns: { col2: { type: 'text' } } }
				];
				const joins = [['col1', 'col2'], ['col2', 'col3']];

				(() => getSources(schemas, joins)).should.throw(Error);
			});
		});

		describe('when given more than one join fewer than schemas', () => {
			it('should throw an error', () => {
				const schemas = [
					{ name: 'table1', columns: { col1: { type: 'text' } } },
					{ name: 'table2', columns: { col2: { type: 'text' } } }
				];
				const joins = [];

				(() => getSources(schemas, joins)).should.throw(Error);
			});
		});

		describe('when given a join column that is not in the schema', () => {
			it('should throw an error', () => {
				const schemas = [
					{ name: 'table1', columns: { col1: { type: 'text' } } },
					{ name: 'table2', columns: { col2: { type: 'text' } } }
				];
				const joins = [['col1', 'col3']];

				(() => getSources(schemas, joins)).should.throw(Error);
			});
		});

		describe('when given one schema', () => {
			it('should return a query without joins', () => {
				const schemas = [{ name: 'table1', columns: { col1: { type: 'text' } } }];
				const joins = undefined;

				getSources(schemas, joins).should.equal(schemas[0].name);
			});
		});

		describe('when given multiple schemas and joins', () => {
			it('should return the query with joins', () => {
				const schemas = [
					{ name: 'table1', columns: { col1: { type: 'text' } } },
					{ name: 'table2', columns: { col2: { type: 'text' } } },
					{ name: 'table3', columns: { col3: { type: 'text' } } }
				];

				const joins = [['col1', 'col2'], ['col2', 'col3']];

				getSources(schemas, joins).should.equal(
					`${schemas[0].name} INNER JOIN ${schemas[1].name} ON ${schemas[0].name}.${joins[0][0]} = ${schemas[1].name}.${joins[0][1]} INNER JOIN ${schemas[2].name} ON ${schemas[1].name}.${joins[1][0]} = ${schemas[2].name}.${joins[1][1]}`
				);
			});
		});
	});
});
