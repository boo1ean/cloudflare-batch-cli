const Promise = require('bluebird');
const assert = require('assert');
const cloudflare = require('cloudflare');
const confirm = require('confirm-cli');

module.exports = function updateDNSRecordsBatch (db, client, from, to) {
	assert(from, 'from ip is required');
	assert(to, 'to ip is required');

	console.log('Changing all adresses %s to %s', from, to);
	confirm('Are you sure?', doUpdate, noop);

	function doUpdate () {
		let count = 0;
		return db.getAsync('zones')
			.map(zone => {
				return Promise.map(zone.dnsRecords, record => {
					if (record.content === from) {
						const req = {
							id: record.id,
							zoneId: zone.id,
							type: record.type,
							name: record.name,
							content: to
						};

						return client.editDNS(cloudflare.DNSRecord.create(req))
							.then(result => {
								count++;
								console.log('Updated %s from %s to %s', record.name, from, to);
							})
							.catch(console.error);
					}
				}, { concurrency: 1 });
			}).then(() => console.log('Updated %s records', count));
	}

	function noop () {
		console.log('nothing to do here');
	}
}
