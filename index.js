#!/usr/bin/env node

const _ = require('lodash');
const assert = require('assert');
const Promise = require('bluebird');
const CFClient = require('cloudflare');
const level = require('level');
const realist = require('realist');
const fs = require('fs');

const fetchAndStoreZones = require('./src/fetch-and-store-zones');
const updateDNSRecordsBatch = require('./src/update-dns-records-batch');
const usage = require('./src/usage');

const db = Promise.promisifyAll(
	level('./db', { valueEncoding: 'json' })
);

const config = JSON.parse(fs.readFileSync('./cloudflare.json').toString());
assert(config.email, 'cloudflare.json config is required with email and key');
assert(config.key, 'cloudflare.json config is required with email and key');

const client = new CFClient(config);

realist({
	'sync': () => fetchAndStoreZones(db, client),
	'change <from> <to>': (opts, from, to) => updateDNSRecordsBatch(db, client, from, to),
	'default': usage
});
