import { Box } from '@chakra-ui/react';
import { EditorView } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { gruvboxDark } from '@uiw/codemirror-theme-gruvbox-dark';
import { useCallback, useEffect, useState } from 'react';
import { IpcRendererEvent } from 'electron';
import { useRecoilState } from 'recoil';
import { textEditorState } from '../state/global'
import CodeMirror from '@uiw/react-codemirror';

let currentdata = "";
let file = "";

export default function TextEditor() {
    const [textState, setTextState] = useRecoilState(textEditorState)

    const onChange = useCallback((value: string) => {
        setTextState(value)
        currentdata = value;
    }, [])

    useEffect(() => {
        window.fileAPI.openFileData((event: IpcRendererEvent, data: object) => {
            try {
                setTextState(data.data)
                currentdata = data.data
                file = data.filename
            } catch (err) {
                console.log(err)
            }
        })

        window.fileAPI.saveFileCommand(() => {
            const data = { 'filename': file, 'data': currentdata }
            window.fileAPI.saveFileData(data)
        })
    }, [])


    return (
        <Box overflow="scroll" h="100%" w="50%" fontSize="1.2rem" >
            <CodeMirror
                height="100%"
                value={textState}
                theme={gruvboxDark}
                onChange={onChange}
                extensions={[
                    markdown({ base: markdownLanguage }),
                    EditorView.lineWrapping,
                ]}
            />
        </Box>
    );
}
