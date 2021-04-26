# 👷 `worker-template` Hello World

A template for kick starting a Cloudflare worker project.

[`index.js`](https://github.com/cloudflare/worker-template/blob/master/index.js) is the content of the Workers script.

#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).

##### Testing
```bash
wranger dev
```

```
curl -X POST -d "taco=bill" http://127.0.0.1:8787/getmaxbid
curl -X POST -d "auction=dummy" http://127.0.0.1:8787/getmaxbid
curl -X POST -d "auction=invaliddummy" http://127.0.0.1:8787/getmaxbid
```

#### Key requirements

```bash
wrangler secret put FAUNA_SECRET
```
