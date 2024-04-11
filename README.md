# Hassio Control ID Monitor

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fdudu631%2Fhome-assistant-mqtt-control-id-monitor)

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


![Supports aarch64 Architecture][aarch64-shield]
![Supports amd64 Architecture][amd64-shield]
![Supports armhf Architecture][armhf-shield]
![Supports armv7 Architecture][armv7-shield]
![Supports i386 Architecture][i386-shield]


[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armhf-shield]: https://img.shields.io/badge/armhf-yes-green.svg
[armv7-shield]: https://img.shields.io/badge/armv7-yes-green.svg
[i386-shield]: https://img.shields.io/badge/i386-yes-green.svg