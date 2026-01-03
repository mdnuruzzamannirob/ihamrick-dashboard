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
  Eraser,
  Undo,
  Redo,
  ChevronDown,
  Unlink,
  PaintBucket,
  Heading1,
  Heading2,
  Heading3,
  FileImage,
  ExternalLink,
  TextQuote,
  Heading6,
  Heading5,
  Heading4,
  Plus,
} from 'lucide-react';

const fontFamilies = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Comic Sans MS',
  'Impact',
];

const fontSizes = [
  '2px',
  '4px',
  '6px',
  '8px',
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '40px',
  '44px',
  '48px',
  '52px',
  '60px',
  '72px',
];

const googleDocsColors = [
  '#000000',
  '#424242',
  '#757575',
  '#BDBDBD',
  '#F5F5F5',
  '#FFFFFF',
  '#D32F2F',
  '#F57C00',
  '#FBC02D',
  '#388E3C',
  '#1976D2',
  '#7B1FA2',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#03A9F4',
  '#00BCD4',
];

const Dropdown = ({ icon: Icon, label, children, active, title }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        title={title}
        className={`flex items-center gap-1 rounded-lg p-2 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 ${
          active || isOpen ? 'bg-indigo-100 font-bold text-indigo-700 shadow-sm' : 'text-slate-600'
        }`}
      >
        {Icon && <Icon size={18} strokeWidth={2.5} />}
        {label && <span className="max-w-20 truncate text-xs font-semibold">{label}</span>}
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 pt-1.5">
          <div className="absolute -top-2 left-0 h-4 w-full" />
          <div className="animate-in fade-in slide-in-from-top-1 min-w-[220px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-xl duration-150">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const ToolbarButton = ({ onClick, active, icon: Icon, title, danger, disabled }: any) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`rounded-lg p-2 transition-all duration-200 ${
      active
        ? 'bg-indigo-100 text-indigo-700 shadow-inner'
        : danger
          ? 'text-rose-500 hover:bg-rose-50'
          : disabled
            ? 'cursor-not-allowed opacity-30'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={18} strokeWidth={2.5} />
  </button>
);

export default function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const [, setUpdate] = React.useState(0);
  React.useEffect(() => {
    if (!editor) return;
    const handler = () => setUpdate((prev) => prev + 1);
    editor.on('transaction', handler);
    return () => {
      editor.off('transaction', handler);
    };
  }, [editor]);

  // --- Helpers for Dynamic Icons & Active States ---
  const getActiveAlignIcon = () => {
    if (editor.isActive({ textAlign: 'center' })) return AlignCenter;
    if (editor.isActive({ textAlign: 'right' })) return AlignRight;
    if (editor.isActive({ textAlign: 'justify' })) return AlignJustify;
    return AlignLeft;
  };

  const getActiveListIcon = () => {
    if (editor.isActive('bulletList')) return List;
    if (editor.isActive('orderedList')) return ListOrdered;
    if (editor.isActive('taskList')) return CheckSquare;
    return List;
  };

  const getActiveHeadingIcon = () => {
    for (let l = 1; l <= 6; l++) {
      if (editor.isActive('heading', { level: l })) {
        const icons = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6];
        return icons[l - 1];
      }
    }
    return Heading1;
  };

  const detectedFont = editor.getAttributes('textStyle')?.fontFamily;
  const detectedSize = editor.getAttributes('textStyle')?.fontSize;
  const currentFont = detectedFont && fontFamilies.includes(detectedFont) ? detectedFont : 'Font';
  const currentSize = detectedSize && fontSizes.includes(detectedSize) ? detectedSize : 'Text';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run();
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sticky top-0 z-30 flex flex-wrap items-center gap-1 border-b border-slate-100 bg-white/95 px-3 py-2 backdrop-blur-md">
      {/* 1. History */}
      <div className="mr-1 flex items-center gap-0.5 border-r border-slate-200 pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          title="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          title="Redo"
        />
      </div>

      {/* Paragraph (Standalone) */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={!editor.isActive('heading')}
        icon={Type}
        title="Paragraph"
      />

      {/* 2. Heading Dropdown (Now Dynamic & Colorful) */}
      <Dropdown icon={getActiveHeadingIcon()} title="Headings" active={editor.isActive('heading')}>
        {[1, 2, 3, 4, 5, 6].map((l) => {
          const HIcons: any = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6];
          const isActive = editor.isActive('heading', { level: l });
          return (
            <button
              key={l}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: l as any })
                  .run()
              }
              className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              {React.createElement(HIcons[l - 1], { size: 16 })} Heading {l}
            </button>
          );
        })}
      </Dropdown>

      {/* Font Family & Size (Colorful when active) */}
      <Dropdown label={currentFont} title="Font Family" active={detectedFont}>
        <div className="custom-scrollbar max-h-60 overflow-y-auto">
          {' '}
          <button
            onClick={() => editor.chain().focus().unsetFontFamily().run()}
            className="dropdown-item text-gray-400 italic"
          >
            Default
          </button>
          <hr className="my-2 text-gray-100" />
          {fontFamilies.map((f) => (
            <button
              key={f}
              onClick={() => editor.chain().focus().setFontFamily(f).run()}
              className={`dropdown-item w-full px-3 py-2 text-left text-sm ${detectedFont === f ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </Dropdown>

      <Dropdown label={currentSize} title="Font Size" active={detectedSize}>
        <div className="custom-scrollbar max-h-60 overflow-y-auto">
          {' '}
          <button
            onClick={() => editor.chain().focus().unsetFontSize().run()}
            className="dropdown-item text-gray-400 italic"
          >
            Default
          </button>
          <hr className="my-2 text-gray-100" />
          {fontSizes.map((s) => (
            <button
              key={s}
              onClick={() => editor.chain().focus().setFontSize(s).run()}
              className={`dropdown-item w-full px-3 py-2 text-left text-sm ${detectedSize === s ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </Dropdown>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* 3. Basic Formatting */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={Bold}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={Italic}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon={Underline}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={Strikethrough}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={TextQuote}
          title="Blockquote"
        />
      </div>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* 4. Colors (Highlight icon when active) */}
      <div className="flex items-center gap-1">
        <Dropdown icon={Type} title="Text Color" active={editor.getAttributes('textStyle').color}>
          <div className="p-2">
            <div className="mb-2 grid grid-cols-5 gap-1.5">
              {googleDocsColors.map((c) => (
                <button
                  key={c}
                  onClick={() => editor.chain().focus().setColor(c).run()}
                  className="h-6 w-6 rounded-full border border-gray-100 hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>{' '}
            <label className="relative flex cursor-pointer items-center gap-2 rounded bg-gray-50 p-1 hover:bg-gray-100">
              <Plus size={14} className="text-gray-400" />
              <span className="text-xs text-gray-600">Custom</span>
              <input
                type="color"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e: any) => editor.chain().focus().setColor(e.target.value).run()}
              />
            </label>
          </div>
        </Dropdown>

        <Dropdown icon={PaintBucket} title="Highlighter" active={editor.isActive('highlight')}>
          <div className="p-2">
            <div className="mb-2 grid grid-cols-5 gap-1.5">
              {googleDocsColors.map((c) => (
                <button
                  key={c}
                  onClick={() => editor.chain().focus().setHighlight({ color: c }).run()}
                  className="h-6 w-6 rounded-full border border-gray-100 hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              className="mb-1 w-full rounded border py-1 text-xs text-slate-500"
            >
              None
            </button>{' '}
            <label className="relative flex cursor-pointer items-center gap-2 rounded bg-gray-50 p-1 hover:bg-gray-100">
              <Plus size={14} className="text-gray-400" />
              <span className="text-xs text-gray-600">Custom</span>
              <input
                type="color"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e: any) =>
                  editor.chain().focus().setHighlight({ color: e.target.value }).run()
                }
              />
            </label>
          </div>
        </Dropdown>
      </div>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* 5. Alignment Dropdown (Now Dynamic & Colorful) */}
      <Dropdown
        icon={getActiveAlignIcon()}
        title="Alignment"
        active={
          editor.isActive({ textAlign: 'center' }) ||
          editor.isActive({ textAlign: 'right' }) ||
          editor.isActive({ textAlign: 'justify' })
        }
      >
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <AlignLeft size={16} /> Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <AlignCenter size={16} /> Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <AlignRight size={16} /> Right
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive({ textAlign: 'justify' }) ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <AlignJustify size={16} /> Justify
        </button>
      </Dropdown>

      {/* 6. List Dropdown (Now Dynamic & Colorful) */}
      <Dropdown
        icon={getActiveListIcon()}
        title="Lists"
        active={
          editor.isActive('bulletList') ||
          editor.isActive('orderedList') ||
          editor.isActive('taskList')
        }
      >
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive('bulletList') ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <List size={16} /> Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive('orderedList') ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <ListOrdered size={16} /> Order List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive('taskList') ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <CheckSquare size={16} /> Task List
        </button>
      </Dropdown>

      {/* 7. Link & Image */}
      <div className="ml-1 flex items-center gap-1 border-l border-slate-200 pl-2">
        <Dropdown icon={Link2} title="Link Options" active={editor.isActive('link')}>
          <button
            onClick={() => {
              const url = prompt('Enter URL');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className="dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
          >
            <Link2 size={16} /> Insert Link
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
            className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${editor.isActive('link') ? 'text-rose-500 hover:bg-rose-50' : 'cursor-not-allowed opacity-30'}`}
          >
            <Unlink size={16} /> Unlink
          </button>
        </Dropdown>

        <Dropdown icon={ImageIcon} title="Image Options">
          <label className="dropdown-item flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">
            <FileImage size={16} /> Upload Image
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
          <button
            onClick={() => {
              const url = prompt('Enter Image URL');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className="dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
          >
            <ExternalLink size={16} /> Via URL
          </button>
        </Dropdown>
      </div>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        active={editor.isActive('superscript')}
        icon={Superscript}
        title="Superscript"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        active={editor.isActive('subscript')}
        icon={Subscript}
        title="Subscript"
      />

      {/* 8. Eraser at Right Side */}
      <div className="ml-auto">
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          icon={Eraser}
          danger
          title="Clear Formatting"
        />
      </div>
    </div>
  );
}
