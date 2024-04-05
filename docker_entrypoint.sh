#!/usr/bin/with-contenv bashio

bashio::log.info "Preparing to start..."

CONFIG_PATH=/data/options.json

SENSOR_EXPIRATION="$(bashio::config 'sensor_expiration')"

bashio::log.info "Sensor expiration {$SENSOR_EXPIRATION}"


bashio::log.info "Starting Control ID Addon..."

exec node ./bin/www