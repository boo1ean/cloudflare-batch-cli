## Cloudflare cli batch operations

### Installation

```
npm install -g cloudflare-batch-cli
```

### Usage

Create `cloudflare.json` config in current folder

```json
{
	"email": "john@galt.com",
	"key": "your api key"
}
```

And run next commands

```
cflare sync
cflare ls 127.0.0.1
cflare change 127.0.0.1 127.0.0.2
```

- First command will sync local database *(this is required)*
- Second command will show domains pointing to `127.0.0.1`
- Last command will change all dns records which point to `127.0.0.1` to `127.0.0.2`

### License

MIT

### GLHF
