<!-- markdownlint-disable MD033 MD041 -->

<p align="center">
  <a href="https://zhenghe.rslc.us/" rel="noopener" target="_blank"><img width="150" src="https://barbierilow.faculty.history.ucsb.edu/Research/ZhengHeMapZoomify/ZhengHe/TileGroup0/6-51-0.jpg" alt="Mao Kun map tile"></a></p>
</p>

<h1 align="center">Mao Kun Map Explorer</h1>

<div align="center">

An interactive map navigating the treasure fleet voyages of [Zheng He](https://en.wikipedia.org/wiki/Zheng_He). Built with [React](https://reactjs.org/) and [Leaflet](https://leafletjs.com/).

<!-- [![codecov](https://codecov.io/gh/carpiediem/maokun-explorer/branch/main/graph/badge.svg)](https://codecov.io/gh/carpiediem/maokun-explorer) -->

[![Known Vulnerabilities](https://snyk.io/test/github/carpiediem/maokun-explorer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/carpiediem/maokun-explorer?targetFile=package.json)
[![DeepScan grade](https://deepscan.io/api/teams/10561/projects/14301/branches/262892/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&tid=10561&pid=14301&bid=262892)
[![CodeClimate maintainability grade](https://img.shields.io/codeclimate/maintainability/carpiediem/maokun-explorer)](https://codeclimate.com/github/carpiediem/maokun-explorer)
[![CI Status](https://img.shields.io/github/workflow/status/carpiediem/maokun-explorer/Node%20CI)](https://github.com/carpiediem/maokun-explorer/actions?query=workflow%3A%22Node+CI%22)
[![deployment status](https://img.shields.io/website?label=zhenghe.rslc.us&url=https%3A%2F%2Fzhenghe.rslc.us)](https://zhenghe.rslc.us)

</div>

## Demo

View this web app at [https://zhenghe.rslc.us](https://zhenghe.rslc.us)

## Installation

This website is built with [node.js](https://nodejs.org/), so ensure you have that installed. Clone a copy of this repository, then use npm or yarn to install dependancies.

```sh
git clone https://github.com/carpiediem/maokun-explorer
cd ./maokun-explorer
npm install
```

## Usage

This website was built with [`create-react-app`](https://reactjs.org/docs/create-a-new-react-app.html), so you can use standard commands:

- `npm start` to launch the site on your own machine
- `npm test` to run the test suite with jest
- `npm run build` to build a static site for deployment

Additional scripts:

- `npm run geojson` to update data files from a spreadsheet on Google Docs
- `npm run tiles` to download an 88MB copy of the 9,887 image tiles that Leaflet arranges to display the Mao Kun map

## Questions

You can reach me at maokun@rslc.us

## Contributing

I'm open to design ideas or pull requests. Just [create an issue](https://github.com/carpiediem/maokun-explorer/issues) in GitHub.

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).
