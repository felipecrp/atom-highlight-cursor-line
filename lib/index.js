'use babel'

import {CompositeDisposable, Range} from 'atom'

function highlightLine(editor, row) {
    let range = new Range([row,0],[row+1,0]);
    let mark = editor.markScreenRange(range);
    editor.decorateMarker(mark, {type: 'highlight', class: 'highlight-line'});
}

function moveHighlight(editor, oldrow, row) {
    if (oldrow == row) {
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
                decoration.destroy();
            }
        }
    }

    highlightLine(editor, row);
}

function removeHighlight(editor) {
    for (let decoration of editor.getDecorations({type: 'highlight', class: 'highlight-line'})) {
        decoration.destroy();
    }
}

const hl = {
    activate() {
        this.listeners = new CompositeDisposable();

        let activeEditor = atom.workspace.getActiveTextEditor();
        if (activeEditor) {
            for (let cursor of activeEditor.getCursors()) {
                let row = cursor.getScreenRow();
                highlightLine(activeEditor, row);
            }
        }

        this.listeners.add(atom.workspace.observeTextEditors((editor) => {
            editor.onDidAddCursor((cursor) => {
                let row = cursor.getScreenRow();
                highlightLine(editor, row);
            });

            editor.onDidRemoveCursor((cursor) => {
                removeHighlight(editor);

                for (let cursor of editor.getCursors()) {
                    let row = cursor.getScreenRow();
                    highlightLine(editor, row);
                }
            });

            editor.onDidChangeCursorPosition((event) => {
                let oldrow = event.oldScreenPosition.row
                let row = event.newScreenPosition.row //event.cursor.getScreenRow();
                moveHighlight(editor, oldrow, row);
            });
        }));
    },
    deactivate() {
        this.listeners.dispose();
    }
}

export default hl;
