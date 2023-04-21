const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  /* */
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(
        {
		  analyzerMode: 'disabled', // or server or static
          analyzerPort: 8090, 
          openAnalyzer: false, // don't open the analyzer automatically
          generateStatsFile: true, // generate a stats.json file
          statsFilename: 'stats.json' // set the name of the stats.json file
        }
      ),
    ],
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

