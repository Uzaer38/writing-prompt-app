'use client';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ToolbarPlugin } from './ToolbarPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';

const editorConfig = {
  namespace: 'writing-prompt-editor',
  theme: {
    root: 'p-2 border rounded-lg min-h-[200px]',
    paragraph: 'mb-2',
  },
  onError: (error: Error) => console.error(error),
  nodes: [HeadingNode, ListNode, ListItemNode]
};

export default function LexicalEditor({
  onChange
}: {
  onChange: (content: string) => void;
}) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="border rounded-lg">
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className="p-4 min-h-[200px]" />}
          placeholder={<div className="p-4 text-gray-400">Start writing...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}

