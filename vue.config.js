module.exports = {
    publicPath: "./",
    devServer: {
        proxy: {
            "/robot": {
                target: "http://116.62.210.250:9000/openapi/api",
                changeOrigin: true,
                secure: false,
                pathRewrite: { // 路径重写
                    '^/robot': ''
                }
            }
        }
    }
}