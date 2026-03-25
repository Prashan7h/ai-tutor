"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

interface Props {
  language: "javascript" | "python";
  defaultValue?: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ language, defaultValue, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const langExtension =
      language === "python" ? python() : javascript();

    const view = new EditorView({
      state: EditorState.create({
        doc: defaultValue ?? "",
        extensions: [
          basicSetup,
          langExtension,
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          }),
          EditorView.theme({
            "&": {
              fontSize: "14px",
              height: "100%",
            },
            ".cm-scroller": {
              overflow: "auto",
              fontFamily:
                "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
            },
            ".cm-content": {
              padding: "12px 0",
            },
            ".cm-gutters": {
              minWidth: "40px",
            },
          }),
        ],
      }),
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={editorRef}
      className="flex-1 min-h-0 overflow-hidden border-b border-zinc-200"
    />
  );
}
