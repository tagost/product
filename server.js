'use strict';

const express = require('express');
// TODO: import the prometheus client library and initialize it
var prometheus = require('prom-client');
const prefix = 'product_svc_';
prometheus.collectDefaultMetrics({ prefix });

const app = express();

app.listen(8080, function () {
    console.log('product-svc started on port 8080');
})

// TODO: Add a new gauge type to collect response time
const responseTime = new prometheus.Gauge({
    name: 'product_svc:spl50_response_time',
    help: 'Time take in seconds to render the 50% special offer page'
});

// TODO: Add a new counter type to collect page view count
const page_views = new prometheus.Counter({
  name: 'product_svc:spl50_page_view_count',
  help: 'No of page views for the 50% special offer page'
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

app.get('/', function (req, res) {
    res.send('Welcome to the Istio store!\n');
})

// This route shows the 50% off discount page
app.get('/spl50', async function (req, res) {
    // TODO
    // 1. Increment the page view counter
    // 2. Start the timer for measuring response time
    responseTime.setToCurrentTime();
    const end = responseTime.startTimer();
    page_views.inc();
    const view_msg = '50% off on purchase of 100 or more items!\n' + 'Hurry! Limited stocks...\n';

    // sleep a little
    await sleep(Math.floor(Math.random() * 200) + 1);

    // TODO: End the timer 
    end();

    // render the page
    res.send(view_msg);
})

// TODO: Expose a '/metrics' end point to allow prometheus to scrape metrics
app.get('/metrics', function (req, res) {
    res.set('Content-Type', prometheus.register.contentType);
    res.send(prometheus.register.metrics());
})

