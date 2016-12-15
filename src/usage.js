module.exports = function printUsage () {
	console.log(`
Batch managing of cloudflare DNS settings

cflare sync                       sync cloudflare data (required for any operation)
cflare ls <addr>                  list all dns records pointing to <addr>
cflare change <from_ip> <to_ip>   update all available DNS records with ip <from_ip> to ip <to_ip>
	`);
}
