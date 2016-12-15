module.exports = function listByAddress (db, addr) {
	let count = 0;

	db.getAsync('zones')
		.map(zone => {
			zone.dnsRecords.map(record => {
				if (record.content === addr) {
					console.log(record.name);
					count++;
				}
			});
		})
		.then(() => console.log('total %s records', count));
}
