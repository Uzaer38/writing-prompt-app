'use client';
import { useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { $getRoot } from 'lexical';
import { Response } from '@/types';
import { EnhancedToolbarPlugin } from './EnhancedToolbarPlugin';

interface EditorProps {
  promptId: string;
  onChange?: (content: string) => void;
  onSubmitSuccess?: (response: Response) => void;
}

const editorConfig = {
  namespace: 'writing-prompt-editor',
  theme: {
    root: 'p-2 border rounded-lg min-h-[200px]',
    paragraph: 'mb-2',
    heading: {
      h1: 'text-3xl font-bold mb-4',
      h2: 'text-2xl font-bold mb-3',
      h3: 'text-xl font-bold mb-2',
    },
    quote: 'border-l-4 border-gray-300 pl-4 italic my-4',
    list: {
      ul: 'list-disc list-inside',
      ol: 'list-decimal list-inside',
    },
    indent: 'ml-4',
    table: 'w-full border-collapse my-4',
    tableCell: 'border border-gray-300 p-2',
    tableRow: 'border-b border-gray-300',
    code: 'bg-gray-100 rounded px-1 font-mono',
    codeHighlight: {
      atrule: 'text-blue-600',
      attr: 'text-purple-600',
      boolean: 'text-red-600',
      builtin: 'text-teal-600',
      cdata: 'text-gray-600',
      char: 'text-green-600',
      class: 'text-purple-600',
      'class-name': 'text-blue-600',
      comment: 'text-gray-500 italic',
      constant: 'text-orange-600',
      deleted: 'text-red-600',
      doctype: 'text-gray-600',
      entity: 'text-yellow-600',
      function: 'text-green-600',
      important: 'text-purple-600',
      inserted: 'text-green-600',
      keyword: 'text-purple-600',
      namespace: 'text-red-600',
      number: 'text-orange-600',
      operator: 'text-indigo-600',
      prolog: 'text-gray-600',
      property: 'text-blue-600',
      punctuation: 'text-gray-700',
      regex: 'text-red-600',
      selector: 'text-purple-600',
      string: 'text-green-600',
      symbol: 'text-orange-600',
      tag: 'text-red-600',
      url: 'text-blue-600',
      variable: 'text-orange-600',
    }
  },
  onError: (error: Error) => console.error(error),
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode
  ]
};

export default function LexicalEditor({ promptId, onChange, onSubmitSuccess }: EditorProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditorChange = (editorState: any) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      setContent(textContent);
      if (onChange) {
        onChange(textContent);
      }
    });
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/prompts/${promptId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      const newResponse = await response.json();
      setContent('');

      if (onSubmitSuccess) {
        onSubmitSuccess(newResponse);
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <LexicalComposer initialConfig={editorConfig}>
        <div className="border rounded-lg">
          <EnhancedToolbarPlugin />
          <RichTextPlugin
            contentEditable={<ContentEditable className="p-4 min-h-[200px] focus:outline-none" />}
            placeholder={<div className="p-4 text-gray-400">Start writing...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      </LexicalComposer>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
        </button>
      </div>
    </div>
  );
}