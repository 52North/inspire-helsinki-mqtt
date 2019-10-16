# INSPIRE Helsinki 2019 MQTT Publisher

Lightweight node.js app that publishes OpenWeatherMap data via MQTT.

# Build

`npm install`

# Run

`node index.js`

# Config

Every relevant parameter can be configured in the `configuration.json`

# Docker

`docker-compose up --build` should do the job.

You can mount an individual config as a volume to `/usr/src/app/configuration.json`.

# License

Apache 2.0
