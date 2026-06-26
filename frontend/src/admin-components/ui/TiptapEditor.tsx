"use client";
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';

export default function TiptapEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full h-auto',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none w-full prose-sm sm:prose-base focus:outline-none min-h-[200px] p-4 bg-white dark:bg-[#1a1b23] border-t border-gray-200 dark:border-gray-800 text-gray-900 dark:!text-white font-normal',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      const response = await axios.post('/api/upload/images', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedUrls = response.data as string[];
      if (uploadedUrls && uploadedUrls.length > 0) {
        editor.chain().focus().setImage({ src: uploadedUrls[0] }).run();
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-[4px] overflow-hidden flex flex-col transition-all focus-within:ring-2 focus-within:ring-[#5865f2]/50">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-[#14151a]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-800 text-[#5865f2]' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-1.5 rounded-[4px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </button>
      </div>
      <EditorContent editor={editor} className="flex-1 custom-scrollbar overflow-y-auto" />
    </div>
  );
}
