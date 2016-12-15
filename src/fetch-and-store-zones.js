const _ = require('lodash');
const Promise = require('bluebird');

module.exports = function fetchAndStoreZones (db, client) {
	let zones = [];

	return fetchZonesPage(1)
		.map(fetchDNSRecords, { concurrency: 3 })
		.then(zones => db.put('zones', zones))
		.then(() => console.log('synced cloudflare config'));

	function fetchZonesPage (page) {
		return Promise.resolve(client.browseZones({
			page: page,
			per_page: 50
		}).then(res => {
			zones = zones.concat(_.map(res.result, zone => _.pick(zone, ['id', 'name'])));
			console.log('sync %s zones', zones.length);
			if (res.result.length === 50) {
				return fetchZonesPage(page + 1);
			}
			return zones;
		}));
	}

	function fetchDNSRecords (zone) {
		return client.browseDNS(zone.id, { per_page: 50 }).then(res => {
			console.log('fetched %s info', zone.name);
			return _.assign(zone, {
				dnsRecords: res.result.map(record => _.pick(record, ['id', 'type', 'name', 'content']))
			});
		})
	}
}
