Pizza Tracker
====

[![wercker status](https://app.wercker.com/status/d3ef8b60ae1a0a19d4b9c41677547448/s/master "wercker status")](https://app.wercker.com/project/byKey/d3ef8b60ae1a0a19d4b9c41677547448)

[@mrhelmut](https://twitter.com/mrhelmut) had the wonderful idea to keep us updated on twitter every time a pizza is consumed. 

Meaning you can now accurately track the pizza count with awesome pizza rain effect!

[![screenshot](https://platane.github.io/pizza-tracker/screen.gif)](https://platane.github.io/pizza-tracker/)

😱

[see the chart!](https://platane.github.io/pizza-tracker/)

# structure

## back

The data are pulled from the twitter API.

The server is actually a [aws lambda function](https://aws.amazon.com/lambda) which writes in a [gist](https://gist.github.com/Platane/20026468d92c5d63a6fe71265d1fda08). It looks for new eligible tweets every 20 minutes.

This approach brings several benefits:
- It's really cheap !  
The aws lambda function runs for ~3s every 20min. It costs nothing while in the free tier, and close to nothing after one year. Gist are free as well. yay!

- As gist are versioned, we get free roll back ( in case something goes horribly wrong ).

- gist are accessed as simple static resources, letting github handle the traffic.

## app

I wanted to use vanilla webGL, with handcrafted shaders!






