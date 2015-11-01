import { select } from './selectQueryBuilder';
import { insert } from './insertQueryBuilder';
import { update } from './updateQueryBuilder';
import { del } from './deleteQueryBuilder';

export default (() => {
	return Object.freeze({
		select,
		insert,
		update,
		del
	});
})();
