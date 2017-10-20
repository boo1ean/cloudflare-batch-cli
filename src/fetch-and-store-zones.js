const _ = require('lodash');
const Promise = require('bluebird');

module.exports = function fetchAndStoreZones (db, client) {
	let zones = [];

	return fetchZonesPage(1)
		.map(zone => fetchDNSRecords(zone, 1), { concurrency: 3 })
		.then(zones => db.put('zones', zones))
		.then(() => console.log('synced cloudflare config'))
		.catch(e => {
			console.error(e.message, e.stack);
			process.exit(1);
		});

	function fetchZonesPage (page) {
		return Promise.resolve(client.browseZones({
			page: page,
			per_page: 500
		}).then(res => {
			zones = zones.concat(_.map(res.result, zone => _.pick(zone, ['id', 'name'])));
			console.log('sync %s zones', zones.length);
			if (res.result.length === 500) {
				return fetchZonesPage(page + 1);
			}
			return zones;
		}));
	}

	function fetchDNSRecords (zone, page = 1) {
		return client.browseDNS(zone.id, { page, per_page: 500 }).then(res => {
			console.log('fetched %s %s dns records, page %s', zone.name, res.result.length, page);
			if (!zone.dnsRecords) {
				zone.dnsRecords = [];
			}
			zone.dnsRecords = zone.dnsRecords.concat(
				res.result.map(record => _.pick(record, ['id', 'type', 'name', 'content']))
			);
			if (res.result.length === 500) {
				return fetchDNSRecords(zone, page + 1);
			}
			return zone;
		})
	}
}
