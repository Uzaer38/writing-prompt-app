import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const buttons: Array<{ label: string; format: TextFormatType }> = [
    { label: 'Bold', format: 'bold' },
    { label: 'Italic', format: 'italic' },
    { label: 'underline', format: 'underline' },
  ];

  return (
    <div className="border-b p-2 flex gap-2">
      {buttons.map((button) => (
        <button
          key={button.format}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, button.format)}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}