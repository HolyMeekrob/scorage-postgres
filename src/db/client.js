import pg from 'pg';

export default (() => {
	const config = {
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		port: process.env.DB_PORT,
		host: process.env.DB_HOST,
		ssl: process.env.DB_SSL
	};

	const makeRequest = (query) => {
		return new Promise((resolve, reject) => {
			pg.connect(config, (connectErr, pgClient, done) => {
				if (connectErr) {
					return reject(
						`Error establishing connection to the database: ${connectErr}`);
				}

				pgClient.query(query, (queryErr, result) => {
					done();

					if (queryErr) {
						return reject(`Error running query: ${queryErr}`);
					}

					return resolve(result);
				});
			});
		});
	};

	return Object.freeze({
		makeRequest
	});
})();
