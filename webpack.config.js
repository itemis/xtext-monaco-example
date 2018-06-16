/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2017 2017 itemis AG (http://www.itemis.de). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildRoot = path.resolve(__dirname, "lib");
const monacoEditorPath = 'node_modules/monaco-editor-core/dev/vs';

module.exports = {
    mode: "development",
    entry: path.resolve(buildRoot, "main.js"),
    output: {
        filename: 'bundle.js',
        path: buildRoot
    },
    module: {
        noParse: /reconnecting-websocket/
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            'vs': path.resolve(buildRoot, monacoEditorPath)
        }
    },
    devtool: 'source-map',
    target: 'web',
    node: {
        fs: 'empty',
        child_process: 'empty',
        net: 'empty',
        crypto: 'empty'
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: monacoEditorPath,
                to: 'vs'
            }
        ])
    ]
}