'use babel'

import {Point, Range} from 'atom'

function a() {
    console.log("onDidAddSelection");
}

function b(event) {
    console.log("onDidChangeSelectionRange");
}

function c() {
    console.log("onDidRemoveSelection");
}

function d() {
    console.log("onDidChangeCursorPosition");
}

const hl = {
    activate () {
        this.subscription = atom.commands.add('atom-text-editor', 'hl:toggle', () => {
            let editor = atom.workspace.getActiveTextEditor()
            if (editor) {
                // @decorateMarker(marker, type: 'line-number', class: 'cursor-line')
                atom.workspace.observeTextEditors((editor) => {
                    // editor.onDidAddSelection((selection) => {
                    //     console.log("onDidAddSelection");
                    //     let marker = editor.markBufferRange(selection.getBufferRange());
                    //     editor.decorateMarker(marker, {type: 'line', class: 'cursor-line2'});
                    // });
                    // editor.onDidChangeSelectionRange((event) => {
                    editor.onDidChangeCursorPosition((event) => {
                        console.log("onDidChangeCursorPosition");
                        let row = event.cursor.getScreenRow();

                        for (let decoration of editor.getDecorations({type: 'highlight', class: 'highlight-line'})) {
                             decoration.destroy();
                        }

                        let range = new Range([row,0],[row+1,0]);
                        // let range = new Range(new Point(row,0),new Point(row,Infinity));
                        let mark = editor.markScreenRange(range);
                        editor.decorateMarker(mark, {type: 'highlight', class: 'highlight-line'});
                    });
                    // editor.onDidRemoveSelection((selection) => {
                    //     console.log("onDidRemoveSelection");
                    //
                    //     let marker = editor.markBufferRange(selection.getBufferRange());
                    //     for (let decoration of editor.getDecorations({ class: 'cursor-line2' })) {
                    //         decoration.destroy();
                    //     }
                    //
                    // });
                    // editor.onDidChangeCursorPosition(d);
                })
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
