#!/usr/bin/with-contenv bashio

bashio::log.info "Preparing to start..."

CONFIG_PATH=/data/options.json

SENSOR_EXPIRATION="$(bashio::config 'sensor_expiration')"

bashio::log.info "Sensor expiration {$SENSOR_EXPIRATION}"

if ! bashio::services.available "mqtt"; then
    bashio::log.error "No internal MQTT service found. Please configure your own."
fi

if bashio::config.is_empty 'mqtt_login' && bashio::var.has_value "$(bashio::services 'mqtt')"; then
    export CONTROL_ID_MQTT_CONFIG_SERVER="mqtt://$(bashio::services 'mqtt' 'host'):$(bashio::services 'mqtt' 'port')"
else
    export CONTROL_ID_MQTT_CONFIG_SERVER="$(bashio::config 'mqtt_server')"
fi
if bashio::config.is_empty 'mqtt_server' && bashio::var.has_value "$(bashio::services 'mqtt')"; then
    export CONTROL_ID_MQTT_CONFIG_USER="$(bashio::services 'mqtt' 'username')"
else
    export CONTROL_ID_MQTT_CONFIG_USER="$(bashio::config 'mqtt_user')"
fi
if bashio::config.is_empty 'mqtt_pw' && bashio::var.has_value "$(bashio::services 'mqtt')"; then
    export CONTROL_ID_MQTT_CONFIG_PASSWORD="$(bashio::services 'mqtt' 'password')"
else
    export CONTROL_ID_MQTT_CONFIG_PASSWORD="$(bashio::config 'mqtt_pw')"
fi

export CONTROL_ID_USER="$(bashio::config 'control_id_user')"
export CONTROL_ID_PW="$(bashio::config 'control_id_pw')"
export CONTROL_ID_IP="$(bashio::config 'control_id_ip')"
export CONTROL_ID_MONITOR_HOST_IP="$(bashio::config 'control_id_monitor_host')"
export CONTROL_ID_MONITOR_PORT="$(bashio::config 'control_id_monitor_port')"
export PORT="$CONTROL_ID_MONITOR_PORT"

bashio::log.info "Server: $CONTROL_ID_MQTT_CONFIG_SERVER"
bashio::log.info "MQTT User: $CONTROL_ID_MQTT_CONFIG_USER"
bashio::log.info "Control Id User: $CONTROL_ID_USER"
bashio::log.info "Control Device IP: $CONTROL_ID_IP"
bashio::log.info "Monitor Host IP: $CONTROL_ID_MONITOR_HOST_IP"
bashio::log.info "Monitor Host Port: $CONTROL_ID_MONITOR_PORT (PORT=$PORT)"


bashio::log.info "Starting Control ID Addon..."

exec node ./bin/www