const {
  override,
  overrideDevServer,
  fixBabelImports,
  addWebpackAlias,
  addPostcssPlugins,
  addLessLoader,
} = require("customize-cra");
const path = require("path");
const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};

module.exports = {
  webpack: override(
    fixBabelImports("import", {
      libraryName: "antd-mobile",
      style: "css",
      remUnit: 37.5
    }),
    addWebpackAlias({
      "@components": pathResolve("src/components"),
      "@utils": pathResolve("src/utils"),
      "@assets": pathResolve("src/assets"),
      "@common": pathResolve("src/common"),
      "@pages": pathResolve("src/pages"),
    }),
    addLessLoader({
      lessOptions: {
        localIdentName: "[local]--[hash:base64:5]",
      },
    }),
    addPostcssPlugins([
      require("postcss-px2rem-exclude")({
        remUnit: 75,
        propList: ["*"],
        // exclude: /node_modules/,
        exclude: /node_modules\/antd-mobile/,
      }),
    ])
  ),
  devServer: overrideDevServer((config) => {
    return {
      ...config,
      proxy: {
        "/api": {
          target: "https://wjq003.139coins.com/index.php/",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "/api",
          },
        },
      },
    };
  }),
};
