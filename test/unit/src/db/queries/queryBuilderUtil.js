import queryBuilderUtil from '../../../../../src/db/queries/queryBuilderUtil';
import chai from 'chai';
chai.should();

const {
	isTableNameValid,
	isTypeMatch,
	getFormattedValue,
	getMisusedColumns,
	getInvalidColumns,
	getTypeMismatchedColumns,
	removeExtraWhitespace
} = queryBuilderUtil;

describe('queryBuilderUtil', () => {
	describe('#isTableNameValid()', () => {
		describe('when given a nill value', () => {
			it('should return false', () => {
				isTableNameValid().should.be.false;
			});
		});

		describe('when given a schema without a name', () => {
			it('should return false', () => {
				isTableNameValid({}).should.be.false;
			});
		});

		describe('when given a schema with a non-string name', () => {
			it('should return false', () => {
				const schema = {
					name: 83
				};

				isTableNameValid(schema).should.be.false;
			});
		});

		describe('when given a schema with a string name', () => {
			it('should return true', () => {
				const schema = {
					name: 'table_name'
				};

				isTableNameValid(schema).should.be.true;
			});
		});
	});

	describe('#isTypeMatch', () => {
		describe('when given a nil value', () => {
			it('should return true', () => {
				isTypeMatch().should.be.true;
			});
		});

		describe('when given a non-nil value and no type', () => {
			it('should throw an error', () => {
				(() => isTypeMatch(1)).should.throw(Error);
			});
		});

		describe('when given a non-nil value and an invalid type', () => {
			it('should throw an error', () => {
				(() => isTypeMatch([1], 'array')).should.throw(Error);
			});
		});

		describe('when given a string and a non-text type', () => {
			it('should return false', () => {
				isTypeMatch('value', 'number').should.be.false;
			});
		});

		describe('when given a string and text type', () => {
			it('should return true', () => {
				isTypeMatch('value', 'text').should.be.true;
			});
		});

		describe('when given a number and a non-number type', () => {
			it('should return false', () => {
				isTypeMatch(3, 'json').should.be.false;
			});
		});

		describe('when given a number and number type', () => {
			it('should return true', () => {
				isTypeMatch(10, 'number').should.be.true;
			});
		});

		describe('when given a boolean and a non-boolean type', () => {
			it('should return false', () => {
				isTypeMatch(true, 'text').should.be.false;
			});
		});

		describe('when given a boolean and boolean type', () => {
			it('should return true', () => {
				isTypeMatch(false, 'boolean').should.be.true;
			});
		});

		describe('when given an object and a non-json type', () => {
			it('should return false', () => {
				isTypeMatch({ prop: 'erty' }, 'boolean').should.be.false;
			});
		});

		describe('when given an object and json type', () => {
			it('should return true', () => {
				isTypeMatch({ id: 94 }, 'json').should.be.true;
			});
		});

		describe('when given a non-string and unique type', () => {
			it('should return false', () => {
				isTypeMatch(181, 'unique').should.be.false;
			});
		});

		describe('when given a non-uuid string and unique type', () => {
			it('should return false', () => {
				isTypeMatch('hello', 'unique').should.be.false;
			});
		});

		describe('when given a uuid string and unique type', () => {
			it('should return true', () => {
				isTypeMatch('A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11', 'unique').should.be.true;
			});
		});
	});

	describe('#getFormattedValue()', () => {
		describe('when given a nil value', () => {
			it('should return null', () => {
				getFormattedValue().toUpperCase().should.equal('NULL');
			});
		});

		describe('when given an invalid type', () => {
			it('should throw an error', () => {
				(() => getFormattedValue('val', 'string')).should.throw(Error);
			});
		});

		describe('when given a value and text type', () => {
			it('should surround with and escape quotes', () => {
				const val = 'bla\'h';

				getFormattedValue(val, 'text')
					.should.equal(`'${val.replace('\'', '\'\'')}'`);
			});
		});

		describe('when given a value and unique type', () => {
			it('should return the value', () => {
				const val = 'CA761232-ED42-11CE-BACD-00AA0057B223';

				getFormattedValue(val, 'unique').should.equal(val);
			});
		});

		describe('when given a value and number type', () => {
			it('should return the value', () => {
				const val = 832;

				getFormattedValue(val, 'number').should.equal(val);
			});
		});

		describe('when given true and a boolean type', () => {
			it('should return true', () => {
				const val = true;

				getFormattedValue(val, 'boolean').toUpperCase().should.equal('TRUE');
			});
		});

		describe('when given false and a boolean type', () => {
			it('should return false', () => {
				const val = false;

				getFormattedValue(val, 'boolean').toUpperCase().should.equal('FALSE');
			});
		});

		describe('when given a value and json type', () => {
			it('should return the stringified json object', () => {
				const val = { prop1: 23, prop2: 'val', prop3: false };
				getFormattedValue(val, 'json').should.equal(JSON.stringify(val));
			});
		});
	});

	describe('#getMisusedColumns()', () => {
		describe('when given a nil schema', () => {
			it('should throw an error', () => {
				const schema = undefined;
				const values = {
					col: 'val'
				};
				const flag = 'flag';

				(() => getMisusedColumns(schema, values, flag)).should.throw(Error);
			});
		});

		describe('when given nil values', () => {
			it('should throw an error', () => {
				const schema = {
					columns: { col: { flag: true } }
				};
				const values = null;
				const flag = 'flag';

				(() => getMisusedColumns(schema, values, flag)).should.throw(Error);
			});
		});

		describe('when given a non-existent flag', () => {
			it('should return all values', () => {
				const schema = {
					columns: { col: { flag: true } }
				};
				const values = { col: 'val' };
				const flag = 'dummyValue';

				const result = getMisusedColumns(schema, values, flag);
				result.length.should.equal(1);
				result.should.include('col');
			});
		});

		describe('when given values that have false flags', () => {
			it('should return those values', () => {
				const schema = {
					columns: { col1: { flag: true }, col2: { flag: false } }
				};
				const values = { col1: 'val1', col2: 'val2' };
				const flag = 'flag';

				const result = getMisusedColumns(schema, values, flag);
				result.length.should.equal(1);
				result.should.include('col2');
			});
		});

		describe('when only given values that have true flags', () => {
			it('should return an empty array', () => {
				const schema = {
					columns: { col1: { flag: true }, col2: { flag: true } }
				};
				const values = { col1: 'val1', col2: 'val2' };
				const flag = 'flag';

				getMisusedColumns(schema, values, flag).should.be.empty;
			});
		});
	});

	describe('#getInvalidColumns()', () => {
		describe('when given a nil schema', () => {
			it('should throw an error', () => {
				const schema = null;
				const values = { key: 'val' };

				(() => getInvalidColumns(schema, values)).should.throw(Error);
			});
		});

		describe('when given nil values', () => {
			it('should throw an error', () => {
				const schema = { columns: { col: {} } };

				(() => getInvalidColumns(schema)).should.throw(Error);
			});
		});

		describe('when given an invalid schema', () => {
			it('should throw an error', () => {
				const schema = { col: {} };
				const values = { col: 'val' };

				(() => getInvalidColumns(schema, values)).should.throw(Error);
			});
		});

		describe('when given values that are not in the schema', () => {
			it('should return those columns', () => {
				const schema = {
					columns: {
						validCol: {}
					}
				};
				const values = {
					validCol: 1, invalidCol1: 'foo', invalidCol2: 'bar'
				};

				const result = getInvalidColumns(schema, values);
				result.length.should.equal(2);
				result.should.include('invalidCol1');
				result.should.include('invalidCol2');
			});
		});

		describe('when given only values that are in the schema', () => {
			it('should return an empty array', () => {
				const schema = {
					columns: {
						validCol1: {},
						validCol2: {},
						validCol3: {}
					}
				};

				const values = {
					validCol1: 1, validCol3: 'foo'
				};

				getInvalidColumns(schema, values).should.be.empty;
			});
		});
	});

	describe('#getTypeMismatchedColumns()', () => {
		describe('when given a nil schema', () => {
			it('should throw an error', () => {
				const schema = undefined;
				const values = { col: 'val' };

				(() => getTypeMismatchedColumns(schema, values)).should.throw(Error);
			});
		});

		describe('when given nil values', () => {
			it('should throw an error', () => {
				const schema = {
					columns: { col: {} }
				};
				const values = null;

				(() => getTypeMismatchedColumns(schema, values)).should.throw(Error);
			});
		});

		describe('when given values that do not match their schema type', () => {
			it('should return those values', () => {
				const schema = {
					columns: {
						col1: { type: 'number' }, col2: { type: 'number' }, col3: { type: 'text' }
					}
				};
				const values = { col1: 12, col2: 'blah', col3: true };

				const result = getTypeMismatchedColumns(schema, values);
				result.length.should.equal(2);
				result.should.include('col2');
				result.should.include('col3');
			});
		});

		describe('when given values that all match their schema type', () => {
			it('should return an empty array', () => {
				const schema = {
					columns: {
						col1: { type: 'number' }, col2: { type: 'text' }, col3: { type: 'boolean' }
					}
				};
				const values = { col1: 4, col2: 'val', col3: false };

				getTypeMismatchedColumns(schema, values).should.be.empty;
			});
		});
	});

	describe('#removeExtraWhitespace()', () => {
		describe('when given nil', () => {
			it('should throw an error', () => {
				(() => removeExtraWhitespace()).should.throw(Error);
			});
		});

		describe('when given a non-string', () => {
			it('should throw an error', () => {
				(() => removeExtraWhitespace()).should.throw(Error);
			});
		});

		describe('when given a string', () => {
			it('should trim spaces and remove all tabs', () => {
				const expected = 'this is    the  text';
				const str = `  \
				${expected}          `;

				removeExtraWhitespace(str).should.equal(expected);
			});
		});
	});
});
