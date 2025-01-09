'use client';
import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function InitialStatePlugin({ initialContent }: { initialContent: string }) {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    const parsedContent = JSON.parse(initialContent);
    editor.setEditorState(editor.parseEditorState(parsedContent));
  }, [editor, initialContent]);

  return null;
}

interface ResponseDisplayProps {
  content: string;
}

const displayConfig = {
  namespace: 'response-display',
  editable: false,
  readOnly: true,
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
  ],
  theme: {
    root: 'p-2',
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
  },
  onError: (error: Error) => {
    console.error('Error in Lexical editor:', error);
  },
};

export default function ResponseDisplay({ content }: ResponseDisplayProps) {
  return (
    <LexicalComposer initialConfig={displayConfig}>
      <div className="relative bg-transparent">
        <InitialStatePlugin initialContent={content} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="focus:outline-none text-white bg-transparent min-h-[1rem]"
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
      </div>
    </LexicalComposer>
  );
}