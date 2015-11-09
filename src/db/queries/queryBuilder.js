import selectBuilder from './selectQueryBuilder';
import insertBuilder from './insertQueryBuilder';
import updateBuilder from './updateQueryBuilder';
import deleteBuilder from './deleteQueryBuilder';

export default (() => {
	return Object.freeze({
		select: selectBuilder.select,
		insert: insertBuilder.insert,
		update: updateBuilder.update,
		del: deleteBuilder.del
	});
})();
