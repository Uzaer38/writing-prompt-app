'use client';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  TextFormatType,
} from 'lexical';
import { useState, useCallback, useEffect } from 'react';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';

export function EnhancedToolbarPlugin() {
  // Helper function to convert hex to RGB number
  const hexToRGB = (hex: string): number => {
    // Remove the # if present
    hex = hex.replace('#', '');
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Combine into a single number (RR GG BB)
    return (r << 16) | (g << 8) | b;
  };

  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('transparent');
  const [blockType, setBlockType] = useState<string>('paragraph');

  const fontSizes = [
    12, 14, 16, 18, 20, 24, 28, 32, 36
  ];

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      const node = selection.anchor.getNode();
      if ($isHeadingNode(node)) {
        setBlockType(node.getTag());
      } else {
        setBlockType('paragraph');
      }
    }
  }, []);

  useEffect(() => {
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize: HeadingTagType | 'paragraph') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (headingSize === 'paragraph') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      }
    });
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-2 items-center bg-gray-50">
      {/* Text Style Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          className={`p-2 rounded hover:bg-gray-200 ${isBold ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          className={`p-2 rounded hover:bg-gray-200 ${isItalic ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          className={`p-2 rounded hover:bg-gray-200 ${isUnderline ? 'bg-gray-200' : ''}`}
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
      </div>

      {/* Font Size */}
      <select
        value={fontSize}
        onChange={(e) => {
          const newSize = Number(e.target.value);
          setFontSize(newSize);
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.formatText('fontSize' as TextFormatType, newSize);
            }
          });
        }}
        className="border rounded p-1"
        title="Font Size"
      >
        {fontSizes.map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>

      {/* Text Color */}
      <input
        type="color"
        value={textColor}
        onChange={(e) => {
          const newColor = e.target.value;
          setTextColor(newColor);
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.formatText('textColor' as TextFormatType, hexToRGB(newColor));
            }
          });
        }}
        className="w-8 h-8 p-0 border rounded cursor-pointer"
        title="Text Color"
      />

      {/* Background Color */}
      <input
        type="color"
        value={bgColor === 'transparent' ? '#ffffff' : bgColor}
        onChange={(e) => {
          const newColor = e.target.value;
          setBgColor(newColor);
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.formatText('backgroundColor' as TextFormatType, hexToRGB(newColor));
            }
          });
        }}
        className="w-8 h-8 p-0 border rounded cursor-pointer"
        title="Highlight Color"
      />

      {/* Block Style Controls */}
      <div className="flex gap-1 border-l border-r px-2">
        <select
          value={blockType}
          onChange={(e) => formatHeading(e.target.value as HeadingTagType | 'paragraph')}
          className="border rounded p-1"
          title="Text Style"
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      {/* List Controls */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          className="p-2 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          className="p-2 rounded hover:bg-gray-200"
          title="Numbered List"
        >
          1.
        </button>
      </div>

      {/* Indentation Controls */}
      <div className="flex gap-1 border-l pl-2">
        <button
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.getNodes().forEach(node => {
                  const element = editor.getElementByKey(node.getKey());
                  if (element) {
                    const currentMargin = parseInt(element.style.marginLeft || '0', 10);
                    element.style.marginLeft = `${currentMargin + 20}px`;
                  }
                });
              }
            });
          }}
          className="p-2 rounded hover:bg-gray-200"
          title="Increase Indent"
        >
          →
        </button>
        <button
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.getNodes().forEach(node => {
                  const element = editor.getElementByKey(node.getKey());
                  if (element) {
                    const currentMargin = parseInt(element.style.marginLeft || '0', 10);
                    element.style.marginLeft = `${Math.max(0, currentMargin - 20)}px`;
                  }
                });
              }
            });
          }}
          className="p-2 rounded hover:bg-gray-200"
          title="Decrease Indent"
        >
          ←
        </button>
      </div>
    </div>
  );
}