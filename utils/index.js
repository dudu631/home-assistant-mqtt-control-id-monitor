const toDashCase = (str) => str?.toLowerCase().replace(/\s+/g, '-');
const toSnakeCase = (str) => str?.toLowerCase().replace(/\s+/g, '_');

const extractDeviceArrayFromString = (str) => {
    if (!str) return [];
    return str.split('\n').map(line => JSON.parse(line));
}

module.exports = { toDashCase, toSnakeCase, extractDeviceArrayFromString }


