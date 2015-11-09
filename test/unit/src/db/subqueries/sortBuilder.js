import sortBuilder from '../../../../../src/db/subqueries/sortBuilder';
import chai from 'chai';
chai.should();

const { getSort } = sortBuilder;

describe('sortBuilder', () => {
	describe('#getSort()', () => {
		describe('when given nil keys', () => {
			it('should return an empty string', () => {
				getSort().should.equal('');
			});
		});

		describe('when given non-array keys', () => {
			it('should throw an error', () => {
				(() => getSort('not an array')).should.throw(Error);
			});
		});

		describe('when given an array containing non-strings', () => {
			it('should throw an error', () => {
				const keys = [ 'one', 2, 'three'];

				(() => getSort(keys)).should.throw(Error);
			});
		});

		describe('when given an array of strings', () => {
			it('should return the correct sort string', () => {
				const keys = ['one', 'two', 'three'];

				const regex = /^ (?:ORDER BY|order by) (.+)$/;
				const sortStr = getSort(keys);
				const result = regex.exec(sortStr);

				result.should.not.be.null;
				result[1].replace(/ /g, '').should.equal(keys.join(','));
			});
		});
	});
});
