"use client";

import { useState } from "react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 兼容退路：弹出选中以便手动拷贝
      window.prompt("复制此链接：", url);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {copied ? "✓ 已复制" : "复制链接"}
    </button>
  );
}
