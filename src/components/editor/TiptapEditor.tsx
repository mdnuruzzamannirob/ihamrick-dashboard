'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { FontSize } from './extensions/FontSize';
import Toolbar from './Toolbar';

export default function TiptapEditor({ value, onChange }: any) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      Superscript,
      Subscript,
      FontFamily,
      FontSize,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      handleKeyDown: (_, event) => {
        if (event.key === 'Tab') {
          editor?.commands.sinkListItem('listItem');
          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="editor-shell">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
