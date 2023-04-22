const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction =  process.env.NODE_ENV === 'production'
const prodOptions = {
		  analyzerMode: 'disabled', // or server or static
          analyzerPort: 8090, 
          openAnalyzer: false, // don't open the analyzer automatically
          generateStatsFile: true, // generate a stats.json file
          statsFilename: 'stats.json' // set the name of the stats.json file
        }

module.exports = {
  /* */ 

  configureWebpack: {
    module: {
      rules: [
        {
          exclude: "/public/php/"
        }
      ],
 
    },
    plugins: isProduction ? [
      new BundleAnalyzerPlugin(prodOptions),
    ]: [],
  },
  /* */
	// or
/*
  chainWebpack: config => {
    config
      .plugin('webpack-bundle-analyzer')
      .use(BundleAnalyzerPlugin,[
        {
          analyzerPort: 8080, 
          openAnalyzer: false, // don't open the analyzer automatically
          generateStatsFile: true, // generate a stats.json file
          statsFilename: 'stats.json' // set the name of the stats.json file
        }
      ]);
  },
*/
};

