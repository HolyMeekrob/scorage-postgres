import { getFields } from '../../../../../src/db/subqueries/fieldsBuilder';
import chai from 'chai';
chai.should();

describe('fieldsBuilder', () => {
	describe('#getFields()', () => {
		describe('when given no arguments', () => {
			it('should return the wildcard', () => {
				getFields().should.equal('*');
			});
		});

		describe('when given fields that are not a string or array', () => {
			it('should throw an error', () => {
				(() => getFields(123)).should.throw(Error);
			});
		});

		describe('when given fields that are a string', () => {
			it('should return the string', () => {
				const fields = 'this, that, the, other';
				getFields(fields).should.equal(fields);
			});
		});

		describe('when given fields that are an array', () => {
			it('should have the fields in correct format', () => {
				const fields = ['left', 'right', 'center'];

				getFields(fields).should.equal(fields.join(', '));
			});
		});
	});
});
