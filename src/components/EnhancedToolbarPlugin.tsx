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
import React, { useState, useCallback, useEffect } from 'react';
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
import { $patchStyleText } from '@lexical/selection';

export function EnhancedToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [currentTextColor, setCurrentTextColor] = useState('#000000');
  const [currentBgColor, setCurrentBgColor] = useState('#ffffff');
  const fontSizes = [
    { label: '12px', value: '12px' },
    { label: '16px', value: '16px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
  ];

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      const node = selection.anchor.getNode();
      const parent = node.getParent();

      if ($isHeadingNode(parent)) {
        setBlockType(parent.getTag());
      } else {
        setBlockType('paragraph');
      }
    }
  }, []);

useEffect(() => {
  const removeSelectionListener = editor.registerCommand(
    SELECTION_CHANGE_COMMAND,
    () => {
      updateToolbar();
      return false;
    },
    COMMAND_PRIORITY_LOW
  );

  const removeUpdateListener = editor.registerUpdateListener(({editorState}) => {
    editorState.read(() => {
      updateToolbar();
    });
  });

  return () => {
    removeSelectionListener();
    removeUpdateListener();
  };
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

  const applyStyleToSelection = (command: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  };

  const applyFontSize = (size: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-size': size });
      }
    });
  };

  const applyTextColor = (color: string) => {
    setCurrentTextColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color });
      }
    });
  };

  const applyBackgroundColor = (color: string) => {
    setCurrentBgColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'background-color': color });
      }
    });
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-2 items-center bg-black-50">
      {/* Text Style Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => applyStyleToSelection('bold')}
          className={`p-2 rounded hover:bg-purple-500 ${isBold ? 'bg-purple-500' : ''}`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => applyStyleToSelection('italic')}
          className={`p-2 rounded hover:bg-purple-500 ${isItalic ? 'bg-purple-500' : ''}`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => applyStyleToSelection('underline')}
          className={`p-2 rounded hover:bg-purple-500 ${isUnderline ? 'bg-purple-500' : ''}`}
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
      </div>

      {/* Font Size */}
      <select
        onChange={(e) => applyFontSize(e.target.value)}
        className="border rounded p-1 bg-purple-900"
        title="Font Size"
        defaultValue="16px"
      >
        {fontSizes.map(size => (
          <option key={size.value} value={size.value}>{size.label}</option>
        ))}
      </select>

      {/* Color Controls */}
      <div className="flex gap-2 items-center border-r pr-2">
        <div className="relative">
          <label className="relative flex flex-col items-center justify-center w-8 h-8 rounded bg-purple-900 hover:bg-purple-500 cursor-pointer">
            <input
              type="color"
              value={currentTextColor}
              onChange={(e) => applyTextColor(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              title="Text Color"
            />
            <span className="text-lg font-bold pointer-events-none">A</span>
            <div
              className="absolute bottom-0 left-1 right-1 h-1 rounded-sm pointer-events-none"
              style={{ backgroundColor: currentTextColor }}
            />
          </label>
        </div>
        <div className="relative">
          <label className="relative flex flex-col items-center justify-center w-8 h-8 rounded bg-purple-900 hover:bg-purple-500 cursor-pointer">
            <input
              type="color"
              value={currentBgColor}
              onChange={(e) => applyBackgroundColor(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              title="Highlight Color"
            />
            <img
              src='/marker.png'
              alt="marker"
              className="h-5 w-auto pointer-events-none"
            />
            <div
              className="absolute bottom-0 left-1 right-1 h-1 rounded-sm pointer-events-none"
              style={{ backgroundColor: currentBgColor }}
            />
          </label>
        </div>
      </div>

      {/* Block Style Controls */}
      <div className="flex gap-1 border-r px-2">
        <select
          value={blockType}
          onChange={(e) => formatHeading(e.target.value as HeadingTagType | 'paragraph')}
          className="border rounded p-1 bg-purple-900"
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
          className="p-2 rounded hover:bg-purple-500"
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          className="p-2 rounded hover:bg-purple-500"
          title="Numbered List"
        >
          1.
        </button>
      </div>
    </div>
  );
}