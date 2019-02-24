module.exports = {
    mode: 'development',
    context: __dirname,
    entry: {
        index: "./index.jsx",
        sales: "./sales.jsx",
        products: "./products.jsx",
        stores: "./stores.jsx"
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js",
        publicPath: "react/dist/"
    },
    watch: true,
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['babel-preset-env', 'babel-preset-react'],
                    plugins: ['transform-class-properties']
                }
            }
        },
        {
            test: /\.(s?)css$/,
            use: [
                'style-loader',
                "css-loader",
                "sass-loader"
            ]
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images/',
                        name: '[name][hash].[ext]',
                    },
                },
            ],
        },
        {
            test: /\.(svg)$/,
            exclude: /fonts/, /* dont want svg fonts from fonts folder to be included */
            use: [
                {
                    loader: 'svg-url-loader',
                    options: {
                        noquotes: true,
                    },
                },
            ],
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        }
        ]
    }
}
