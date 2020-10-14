// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules');

const transpiledModules = [];
// transpiledModules.push('@amplitude-private/skylab-js-server');
module.exports = withTM(transpiledModules)();
