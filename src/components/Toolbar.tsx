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
  FileImage,
  ExternalLink,
  TextQuote,
} from 'lucide-react';

// --- Smart Dropdown: Prevents accidental closing ---
const Dropdown = ({ icon: Icon, label, children, active, title }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150); // Faster close for snappy feel
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
        className={`flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 ${
          active || isOpen ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-600'
        }`}
      >
        {Icon && <Icon size={18} strokeWidth={2.5} />}
        {label && <span className="text-xs font-semibold">{label}</span>}
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 pt-1.5">
          {/* Bridge to keep menu open */}
          <div className="absolute -top-2 left-0 h-4 w-full" />

          <div className="animate-in fade-in slide-in-from-top-1 min-w-[220px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-xl duration-150">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const ToolbarButton = ({ onClick, active, icon: Icon, title, danger }: any) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`rounded-lg p-2 transition-all duration-200 ${
      active
        ? 'bg-indigo-100 text-indigo-700 shadow-inner'
        : danger
          ? 'text-rose-500 hover:bg-rose-50'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={18} strokeWidth={2.5} />
  </button>
);

export default function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  // --- Configuration Data ---
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

  const presetColors = [
    '#000000',
    '#475569',
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#10B981',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#7dd3fc',
  ];
  const presetHighlights = [
    '#FEF08A',
    '#BBF7D0',
    '#BFDBFE',
    '#DDD6FE',
    '#FBCFE8',
    '#FECACA',
    '#e2e8f0',
    '#ffedd5',
  ];

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

      {/* 2. Text Style (Headings) */}
      <Dropdown icon={Heading1} title="Headings">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className="dropdown-item"
        >
          Paragraph
        </button>
        {[1, 2, 3, 4, 5, 6].map((l) => (
          <button
            key={l}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: l as any })
                .run()
            }
            className="dropdown-item font-bold"
          >
            Heading {l}
          </button>
        ))}
      </Dropdown>

      {/* 3. Fonts (Expanded) */}
      <Dropdown label="Font">
        <div className="custom-scrollbar max-h-60 overflow-y-auto">
          {fontFamilies.map((f) => (
            <button
              key={f}
              onClick={() => editor.chain().focus().setFontFamily(f).run()}
              className="dropdown-item"
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </Dropdown>

      <Dropdown label="Size">
        <div className="custom-scrollbar max-h-60 overflow-y-auto">
          <button
            onClick={() => editor.chain().focus().unsetFontSize().run()}
            className="dropdown-item text-gray-400 italic"
          >
            Default
          </button>
          {fontSizes.map((s) => (
            <button
              key={s}
              onClick={() => editor.chain().focus().setFontSize(s).run()}
              className="dropdown-item"
            >
              {s}
            </button>
          ))}
        </div>
      </Dropdown>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* 4. Formatting (Bold, Italic, Quote included) */}
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

      {/* 5. Colors (Separated Text & Background) */}
      <div className="flex items-center gap-1">
        {/* TEXT COLOR */}
        <Dropdown icon={Type} title="Text Color">
          <div className="p-1">
            <div className="mb-2 px-1 text-xs font-semibold text-gray-500">Text Color</div>
            <div className="mb-2 grid grid-cols-5 gap-1.5">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => editor.chain().focus().setColor(c).run()}
                  className="h-6 w-6 rounded-full border border-gray-100 shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            {/* Custom Input */}
            <label className="flex cursor-pointer items-center gap-2 rounded bg-gray-50 p-1 hover:bg-gray-100">
              <div className="h-5 w-5 rounded-full border border-gray-300 bg-linear-to-br from-red-500 via-green-500 to-blue-500" />
              <span className="text-xs text-gray-600">Custom</span>
              <input
                type="color"
                className="absolute h-8 w-8 cursor-pointer opacity-0"
                onInput={(e: any) => editor.chain().focus().setColor(e.target.value).run()}
              />
            </label>
          </div>
        </Dropdown>

        {/* BACKGROUND / HIGHLIGHTER */}
        <Dropdown icon={PaintBucket} title="Background Color">
          <div className="p-1">
            <div className="mb-2 px-1 text-xs font-semibold text-gray-500">Highlighter</div>
            <div className="mb-2 grid grid-cols-4 gap-1.5">
              {presetHighlights.map((c) => (
                <button
                  key={c}
                  onClick={() => editor.chain().focus().setHighlight({ color: c }).run()}
                  className="h-6 w-6 rounded-full border border-gray-100 shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            {/* Custom Input */}
            <div className="flex gap-1">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded bg-gray-50 p-1 hover:bg-gray-100">
                <div className="h-4 w-4 rounded border border-gray-300 bg-yellow-200" />
                <span className="text-xs text-gray-600">Custom</span>
                <input
                  type="color"
                  className="absolute h-8 w-full cursor-pointer opacity-0"
                  onInput={(e: any) =>
                    editor.chain().focus().setHighlight({ color: e.target.value }).run()
                  }
                />
              </label>
              <button
                onClick={() => editor.chain().focus().unsetHighlight().run()}
                className="flex-1 rounded border border-slate-200 bg-white p-1 text-xs text-slate-500 hover:bg-slate-50"
              >
                None
              </button>
            </div>
          </div>
        </Dropdown>
      </div>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* 6. Alignment */}
      <Dropdown icon={AlignLeft} title="Alignment">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className="dropdown-item gap-2"
        >
          <AlignLeft size={16} /> Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className="dropdown-item gap-2"
        >
          <AlignCenter size={16} /> Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className="dropdown-item gap-2"
        >
          <AlignRight size={16} /> Right
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className="dropdown-item gap-2"
        >
          <AlignJustify size={16} /> Justify
        </button>
      </Dropdown>

      {/* 7. Lists */}
      <Dropdown icon={List} title="Lists">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="dropdown-item gap-2"
        >
          <List size={16} /> Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="dropdown-item gap-2"
        >
          <ListOrdered size={16} /> Order List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className="dropdown-item gap-2"
        >
          <CheckSquare size={16} /> Task List
        </button>
      </Dropdown>

      {/* 8. SEPARATED Link & Image Sections */}
      <div className="ml-1 flex items-center gap-1 border-l border-slate-200 pl-2">
        {/* LINK SECTION */}
        <Dropdown icon={Link2} title="Link Options">
          <button
            onClick={() => {
              const url = prompt('Enter URL');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className="dropdown-item gap-2"
          >
            <Link2 size={16} /> Insert Link
          </button>

          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
            className={`dropdown-item gap-2 ${editor.isActive('link') ? 'text-rose-500' : 'cursor-not-allowed text-gray-300'}`}
          >
            <Unlink size={16} /> Unlink
          </button>
        </Dropdown>

        {/* IMAGE SECTION */}
        <Dropdown icon={ImageIcon} title="Image Options">
          <label className="dropdown-item cursor-pointer gap-2">
            <FileImage size={16} /> Upload from Computer
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
          <button
            onClick={() => {
              const url = prompt('Enter Image URL');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className="dropdown-item gap-2"
          >
            <ExternalLink size={16} /> Insert via URL
          </button>
        </Dropdown>
      </div>

      {/* 9. Utilities */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        active={editor.isActive('superscript')}
        icon={Superscript}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        active={editor.isActive('subscript')}
        icon={Subscript}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        icon={Eraser}
        danger
        title="Clear Formatting"
      />
    </div>
  );
}
