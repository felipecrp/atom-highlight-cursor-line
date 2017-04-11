'use babel'

import {Range} from 'atom'

const hl = {
    activate () {
        this.subscription = atom.commands.add('atom-text-editor', 'hl:toggle', () => {
            let editor = atom.workspace.getActiveTextEditor()
            if (editor) {
                atom.workspace.observeTextEditors((editor) => {
                    editor.onDidAddCursor((cursor) => {
                        let row = cursor.getScreenRow();
                        console.log("add selection to " + row);
                        let range = new Range([row,0],[row+1,0]);
                        let mark = editor.markScreenRange(range);
                        editor.decorateMarker(mark, {type: 'highlight', class: 'highlight-line'});
                    });

                    editor.onDidRemoveCursor((cursor) => {
                        let oldrow = cursor.getMarker().getScreenRange().start.row;//.getBufferPosition().row;
                        console.log("delete " + oldrow);

                        for (let decoration of editor.getDecorations({type: 'highlight', class: 'highlight-line'})) {
                            let markerStart = decoration.getMarker().getScreenRange().start;
                            let startRow = markerStart.row;
                            if (oldrow == startRow) {
                                let hasCursor = false;
                                for (let cursorPosition of editor.getCursorScreenPositions()) {
                                    var cursorRow = cursorPosition.row;
                                    if (cursorRow == oldrow) {
                                        hasCursor = true;
                                    }
                                }

                                if (!hasCursor) {
                                    console.log("delete " + startRow)
                                    decoration.destroy();
                                }
                            }
                        }
                    });

                    editor.onDidChangeCursorPosition((event) => {
                        console.log("onDidChangeCursorPosition");
                        let oldrow = event.oldScreenPosition.row
                        let row = event.newScreenPosition.row //event.cursor.getScreenRow();
                        console.log(oldrow + " to " + row);

                        if (oldrow == row) {
                            console.log("same row: " + row);
                            return;
                        }

                        for (let decoration of editor.getDecorations({type: 'highlight', class: 'highlight-line'})) {
                            let markerStart = decoration.getMarker().getScreenRange().start;
                            let startRow = markerStart.row;
                            if (oldrow == startRow) {
                                let hasCursor = false;
                                for (let cursorPosition of editor.getCursorScreenPositions()) {
                                    var cursorRow = cursorPosition.row;
                                    if (cursorRow == oldrow) {
                                        hasCursor = true;
                                    }
                                }

                                if (!hasCursor) {
                                    console.log("delete " + startRow)
                                    decoration.destroy();
                                }
                            }
                        }

                        let range = new Range([row,0],[row+1,0]);
                        let mark = editor.markScreenRange(range);
                        editor.decorateMarker(mark, {type: 'highlight', class: 'highlight-line'});
                    });
                });
            }
        })
    },
    deactivate () {
        this.subscription.dispose()
    }
}

function update(editor, selection, removeSelection) {
    let marker = editor.markBufferRange(selection.getBufferRange());
    if (removeSelection) {
        for (let decoration of editor.getDecorations({ class: 'cursor-line2' })) {
            decoration.destroy();
        }
    }

    editor.decorateMarker(marker, {type: 'line', class: 'cursor-line2'});
}

export default hl;
