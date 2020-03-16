# Community Snow Observations Web App

Community Snow Observations's web application is an interactive platform for viewing and exploring data collected by the project.

## Getting Started

CSO's web app is built using Facebook's [React](https://github.com/facebook/react) library, and [Next.js](https://github.com/zeit/next.js), a framework for React development. Application state is managed using [Redux](https://github.com/reduxjs/redux), and [Saga](https://github.com/redux-saga/redux-saga) is utilzied to handle asynchronous updates.

### Running in development
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

3. Add mapbox variables to env file
```
MAPBOX_TOKEN={INSERT_MAPBOX_TOKEN_HERE}
MAPBOX_STYLE={INSERT_MAPBOX_STYLE_URL_HERE}
```
4. Run frontend server
```
yarn run dev
```
5. Go to <localhost:3000>

### Packaging as static site

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

### Configuration

Most configuration options, including the theme, and filters, are defined in the `config` folder of the application. Some hardcoded configuration still exists throughout the application, but the aim is to move this code into the `config` folder to make modifying or retheming the application. When complete, this would allow easy reconfiguration, and possible re-use by similar projects.

### Filtering

Filters are used in the application to select relevant observations. Current filter types include range filters, geometry filters, and discrete (categorical) filters. In order to speed up filtering, complete recaulations are not performed at every filter update event. Rather, cached intermediate results are used to speed up performance, and many updates are rendered efficiently on the map using GPU processing, while CPU updates, which are used to update the analytics panel, are debounced for better performance. To aid this process, the filtering process is expressed as a computational graph, and updates are only calculated as needed, when application updates invalidate existing results. 

### UI

UI components are separated into three scales. Small, resuable components are defined within the `components/atoms` folders. Compound components are defined in `components/molecules`. Very large components are defined in `components/cells`. This approach roughly conforms to the [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/).

### TODO

 - CSV downloads
 - Pinable tooltip
 - Fully separate configuration out from other areas of application, particularly UI
 - Restructure and simplify code behind UI components
 - Add further documentation
 - Adapt to mobile browsers
 - Preload icons (geofilter mode icons, for instance)
