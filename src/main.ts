/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2017 2017 itemis AG (http://www.itemis.de). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
window.onload = () => {
    const w = <any>window;
    // load Monaco code
    w.require(['vs/editor/editor.main'], () => {
        // load client code
        require('./client');
    });
};