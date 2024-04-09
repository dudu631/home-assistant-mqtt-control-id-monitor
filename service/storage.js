const devicesMap = new Map();

const setDevice = (device) => {
    if (!device.id) {
        console.error('Trying to set a device without id');
        return;
    }
    devicesMap.set(device.id, device);
};

const getDevice = (controlDeviceId) => {
    return devicesMap.get(controlDeviceId);
}

module.exports = {
    setDevice,
    getDevice,
}