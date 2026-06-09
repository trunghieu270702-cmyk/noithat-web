"use client";
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote } from 'lucide-react';

export default function TiptapEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[200px] p-4 bg-white dark:bg-[#0b0c10] border-t border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col transition-all focus-within:ring-2 focus-within:ring-[#5865f2]/50">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-[#14151a]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="flex-1 custom-scrollbar overflow-y-auto" />
    </div>
  );
}
