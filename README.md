# Community Snow Observations Web App

This is a Web Application for NASA Community Science Observations.

The main website can be found [here](http://communitysnowobs.org).

## Running in development
*The following steps can be followed using either yarn or npm*

1. Install necessary packages

```
cd src
yarn install
```

2. Create .env file
```
touch .env
```

3. Add mapbox token to env file
```
MAPBOX_TOKEN={INSERT_MAPBOX_TOKEN_HERE}
```
4. Run frontend server
```
yarn run dev
```
5. Go to <localhost:3000>

## Packaging as static site

1. Build production version of site
```
yarn run build
```

2. Export site
```
yarn run export
```
3. Push site to S3 bucket (Requires AWS sign in).
Modify the `build` script in `package.json` to use your bucket of choice, then run
```yarn run push```
