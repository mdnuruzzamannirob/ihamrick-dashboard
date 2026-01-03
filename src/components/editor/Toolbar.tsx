'use client';

import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Link2,
  Image as ImageIcon,
  Type,
  Superscript,
  Subscript,
  Quote,
  Eraser,
  Undo,
  Redo,
  ChevronDown,
  Unlink,
  PaintBucket,
  Heading1,
  FileImage,
  ExternalLink,
} from 'lucide-react';

// ---------------- Dropdown ----------------
const Dropdown = ({ icon: Icon, label, children, title }: any) => {
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (t.current) clearTimeout(t.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        t.current = setTimeout(() => setOpen(false), 120);
      }}
    >
      <button
        type="button"
        title={title}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
      >
        {Icon && <Icon size={18} />}
        {label && <span className="text-xs font-semibold">{label}</span>}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-xl border bg-white p-2 shadow-xl">
          {children}
        </div>
      )}
    </div>
  );
};

// ---------------- Button ----------------
const Btn = ({ icon: Icon, onClick, active, danger, title }: any) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`rounded-lg p-2 transition ${
      active
        ? 'bg-indigo-100 text-indigo-700'
        : danger
          ? 'text-rose-500 hover:bg-rose-50'
          : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={18} />
  </button>
);

// ---------------- Toolbar ----------------
export default function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const fonts = ['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New'];
  const sizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px'];
  const colors = ['#000000', '#475569', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6'];
  const highlights = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fde68a'];

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
    reader.readAsDataURL(file);
  };

  return (
    <div className="sticky top-0 z-30 flex flex-wrap items-center gap-1 border-b bg-white px-3 py-2">
      {/* Undo / Redo */}
      <Btn icon={Undo} onClick={() => editor.chain().focus().undo().run()} />
      <Btn icon={Redo} onClick={() => editor.chain().focus().redo().run()} />

      {/* Heading */}
      <Dropdown icon={Heading1} title="Headings">
        <button
          className="dropdown-item"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Paragraph
        </button>
        {[1, 2, 3, 4, 5, 6].map((l) => (
          <button
            key={l}
            className="dropdown-item"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: l as any })
                .run()
            }
          >
            Heading {l}
          </button>
        ))}
      </Dropdown>

      {/* Font */}
      <Dropdown label="Font">
        {fonts.map((f) => (
          <button
            key={f}
            className="dropdown-item"
            style={{ fontFamily: f }}
            onClick={() => editor.chain().focus().setFontFamily(f).run()}
          >
            {f}
          </button>
        ))}
      </Dropdown>

      {/* Size */}
      <Dropdown label="Size">
        {sizes.map((s) => (
          <button
            key={s}
            className="dropdown-item"
            onClick={() => editor.chain().focus().setFontSize(s).run()}
          >
            {s}
          </button>
        ))}
      </Dropdown>

      {/* Marks */}
      <Btn
        icon={Bold}
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <Btn
        icon={Italic}
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Btn
        icon={Underline}
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <Btn
        icon={Strikethrough}
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <Btn
        icon={Quote}
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      {/* Colors */}
      <Dropdown icon={Type} title="Text Color">
        <div className="grid grid-cols-6 gap-1">
          {colors.map((c) => (
            <button
              key={c}
              className="h-5 w-5 rounded-full border"
              style={{ background: c }}
              onClick={() => editor.chain().focus().setColor(c).run()}
            />
          ))}
        </div>
      </Dropdown>

      <Dropdown icon={PaintBucket} title="Highlight">
        <div className="grid grid-cols-4 gap-1">
          {highlights.map((c) => (
            <button
              key={c}
              className="h-5 w-5 rounded"
              style={{ background: c }}
              onClick={() => editor.chain().focus().setHighlight({ color: c }).run()}
            />
          ))}
        </div>
      </Dropdown>

      {/* Alignment */}
      <Dropdown icon={AlignLeft} title="Align">
        <button
          className="dropdown-item"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={14} /> Left
        </button>
        <button
          className="dropdown-item"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={14} /> Center
        </button>
        <button
          className="dropdown-item"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={14} /> Right
        </button>
        <button
          className="dropdown-item"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify size={14} /> Justify
        </button>
      </Dropdown>

      {/* Lists */}
      <Dropdown icon={List} title="Lists">
        <button
          className="dropdown-item"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={14} /> Bullet
        </button>
        <button
          className="dropdown-item"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} /> Ordered
        </button>
        <button
          className="dropdown-item"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquare size={14} /> Task
        </button>
      </Dropdown>

      {/* Link & Image */}
      <Dropdown icon={Link2} title="Link">
        <button
          className="dropdown-item"
          onClick={() => {
            const url = prompt('Enter URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Insert link
        </button>
        <button
          className="dropdown-item text-rose-500"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink size={14} /> Unlink
        </button>
      </Dropdown>

      <Dropdown icon={ImageIcon} title="Image">
        <label className="dropdown-item cursor-pointer">
          <FileImage size={14} /> Upload
          <input type="file" hidden accept="image/*" onChange={uploadImage} />
        </label>
        <button
          className="dropdown-item"
          onClick={() => {
            const url = prompt('Image URL');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <ExternalLink size={14} /> URL
        </button>
      </Dropdown>

      {/* Utils */}
      <Btn
        icon={Superscript}
        active={editor.isActive('superscript')}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      />
      <Btn
        icon={Subscript}
        active={editor.isActive('subscript')}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      />
      <Btn
        icon={Eraser}
        danger
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      />
    </div>
  );
}
