# Pizza Tracker

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/platane/pizza-tracker/main?label=main&style=flat-square)](https://github.com/Platane/pizza-tracker/actions?query=workflow%3Amain)

> Track the pizza you eat over the year !

[@mrhelmut](https://twitter.com/mrhelmut) had the wonderful idea to keep us updated on [twitter](https://twitter.com/mrhelmut/status/818428553289236480) every time a pizza is consumed.

This app crunch the data into beautiful 3d charts.

[![screenshot](https://platane.github.io/pizza-tracker/screen.gif)](https://platane.github.io/pizza-tracker/)

[see the chart!](https://platane.github.io/pizza-tracker/)

# Features

### **Crawler**

Every 20min a **aws lambda** kicks in and fetch the latest tweets.

Two strategies for the **twitter api**:

- using the search endpoint, but it only allows to get tweets not older than 7 days
- get all the tweet and filter after, which is obviously costly in term of request and api credit

As storage, the crawler writes on a [**gist** file](https://gist.github.com/Platane/20026468d92c5d63a6fe71265d1fda08).

### **Procedural pizza generator**

The cute pizzas used as particles are generated **procedurally** from a random seed.

### **3d Charts**

The charts are drawn with vanilla **webgl**. From handmade shaders.

### **Deployment**

Deployment on aws is automated with **serverless**.

Static assets are served from **github pages**. _( there is also a lambda ready to serve the assets, but the [url is less friendly](https://elbx5mgdlk.execute-api.eu-west-1.amazonaws.com/stage) )_

**Github actions** automatically run tests and deployment on commit.

# Usage

`yarn install`

`yarn dev`

# License

[MIT](./LICENSE.md)
