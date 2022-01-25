const register = require('@babel/register');
register({
  extensions: [ '.js', '.ts', ],
});

require('./src/app.ts');