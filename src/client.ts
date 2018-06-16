/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2017 itemis AG (http://www.itemis.de). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { listen, MessageConnection } from 'vscode-ws-jsonrpc';
import {
    BaseLanguageClient, CloseAction, ErrorAction,
    createMonacoServices, createConnection
} from 'monaco-languageclient';
const ReconnectingWebSocket = require('reconnecting-websocket');

// register Monaco languages
monaco.languages.register({
    id: 'mydsl',
    extensions: ['.mydsl'],
    aliases: ['mydsl'],
    mimetypes: ['application/mydsl'],
});

// create Monaco editor
const value = `Hello Xtext!
Hello VSCode from Xtext!
Hello ThisFile from Other!
Hello you!`;
const editor = monaco.editor.create(document.getElementById("container")!, {
    model: monaco.editor.createModel(value, 'mydsl', monaco.Uri.parse('file:///Users/dietrich/git/xtext-languageserver-example/demo/a.mydsl')),
    glyphMargin: true
});

// create the web socket
const webSocket = createWebSocket('ws://localhost:8080/lsp');
console.log(webSocket)
// listen when the web socket is opened
listen({
    webSocket,
    onConnection: connection => {
        // create and start the language client
        const languageClient = createLanguageClient(connection);
        const disposable = languageClient.start();
        connection.onClose(() => disposable.dispose());
    }
});

const services = createMonacoServices(editor, {rootUri: "file:///Users/dietrich/git/xtext-languageserver-example/demo/"});
function createLanguageClient(connection: MessageConnection): BaseLanguageClient {
    return new BaseLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['mydsl'],
            // disable the default error handler
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.DoNotRestart
            }
        },
        services,
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
            }
        }
    })
}

function createWebSocket(url: string): WebSocket {
    const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: 3,
        debug: true
    };
    return new ReconnectingWebSocket(url, "mydsl", socketOptions);
}
