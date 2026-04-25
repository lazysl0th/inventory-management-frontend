import { resolve } from 'path';
import { projectDir } from './webpack.common.js';

export default {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: resolve(projectDir, '..', './dist'),
        compress: true,
        port: 8080,
        open: true,
        hot: true,
        historyApiFallback: true
    },
}