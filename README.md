# Hassio Control ID Monitor

This addon will enable to monitor access events on Control ID face scans.

Will add more functionality later if needed.

## Configuration:

The addon automatically identifies your mqtt connection if you use the Mosquitto addon. If not you can provide them in the configuration page.

### Quick start
On `control_id_devices`, fill the IP of the Control ID device you installed, make sure to make that IP reserved so it doesn't change on DHCP. You can add multiple devices as following:

Example
```
    - control_id_ip: 192.168.0.120
      control_id_name: Control ID Face Entrance
    - control_id_ip: 192.168.0.125
      control_id_name: Control ID Face Backdoor
```

The addon will create a different device on Home Assistant for each, using the `control_id_name`.

### Other Configuration
You can change any other default configuration and even pass the `control_id_home_assistant_ip` if the addon fails to get your LAN IP for the monitor to work.
