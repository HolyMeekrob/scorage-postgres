import conditionsBuilder from '../../../../../src/db/subqueries/conditionsBuilder';
import chai from 'chai';
chai.should();

const { getConditions } = conditionsBuilder;

describe('conditionsBuilder', () => {
	describe('#getConditions', () => {
		describe('when given conditions that are not an array', () => {
			it('should throw an error', () => {
				(() => getConditions('not an array')).should.throw(Error);
			});
		});

		describe('when given a condition that is a non-two element array', () => {
			it('should throw an error', () => {
				const conditions = [['key', 'value'], ['a'], ['b'], ['c']];
				(() => getConditions(conditions)).should.throw(Error);
			});
		});

		describe('when given valid conditions', () => {
			it('should have its conditions set', () => {
				const key1 = 'key';
				const key2 = 'otherKey';
				const val1 = 'this is the value';
				const val2 = 231;

				const conditions = [[key1, val1], [key2, val2]];
				const conditionsStr = getConditions(conditions);

				const regex = /^ (?:WHERE|where) (.+=.+) (?:AND|and) (.+=.+)$/;
				const result = regex.exec(conditionsStr);

				const testCondition = (clause) => {
					return clause === `${key1} = '${val1}'`
					|| clause === `${key2} = ${val2}`;
				};

				result.should.not.be.null;
				const cond1 = result[1];
				const cond2 = result[2];
				cond1.should.not.deep.equal(cond2);
				cond1.should.satisfy(testCondition);
				cond2.should.satisfy(testCondition);
			});
		});

		describe('when given conditions with multiple accepted values', () => {
			it('should have its conditions set appropriately', () => {
				const key = 'key';
				const val1 = 'val1';
				const val2 = 'val2';
				const val3 = 'val3';
				const vals = [val1, val2, val3];
				const conditions = [[key, vals]];

				const conditionsStr = getConditions(conditions);

				const regex = /^ (?:WHERE|where) (\w+) IN \(((?:'\w+', )+)('\w+')\)$/;
				const result = regex.exec(conditionsStr);

				result.should.not.be.null;
				result[1].should.equal(key);
				result[2].should.equal(`'${val1}', '${val2}', `);
				result[3].should.equal(`'${val3}'`);
			});
		});
	});
});
