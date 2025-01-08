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
import { $getRoot, $getSelection, EditorState } from 'lexical';
import { Response } from '@/types';
import { EnhancedToolbarPlugin } from './EnhancedToolbarPlugin';

interface EditorProps {
  promptId: string;
  onChange?: (content: string) => void;
  onSubmitSuccess?: (response: Response) => void;
}

const editorNodes = [
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
];

const editorTheme = {
  root: 'p-2 border rounded-lg min-h-[200px]',
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
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
  code: 'bg-gray-100 rounded px-1 font-mono'
};

export default function LexicalEditor({ promptId, onChange, onSubmitSuccess }: EditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEditorState, setCurrentEditorState] = useState<EditorState | null>(null);

  const handleEditorChange = (state: EditorState) => {
    setCurrentEditorState(state);

    if (onChange) {
      state.read(() => {
        const root = $getRoot();
        const selection = $getSelection();
        const jsonString = JSON.stringify(state.toJSON());
        onChange(jsonString);
      });
    }
  };

  const handleSubmit = async () => {
    if (!currentEditorState) return;

    let hasContent = false;
    currentEditorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      hasContent = text.trim().length > 0;
    });

    if (!hasContent) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/prompts/${promptId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: JSON.stringify(currentEditorState.toJSON())
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      const newResponse = await response.json();

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
      <LexicalComposer
        initialConfig={{
          namespace: 'RichTextEditor',
          theme: editorTheme,
          nodes: editorNodes,
          onError: (error: Error) => {
            console.error(error);
          },
        }}
      >
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
          disabled={isSubmitting || !currentEditorState}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
        </button>
      </div>
    </div>
  );
}