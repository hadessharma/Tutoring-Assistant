import React from "react";

const renderText = (text: string) => {
  const codeParts = text.split('`');
  return codeParts.map((part, i) => {
    if (i % 2 === 1) {
      return <code key={i} className="bg-black/30 text-primary-gold px-1.5 py-0.5 rounded text-sm break-words">{part}</code>;
    }
    const boldParts = part.split('**');
    return boldParts.map((bPart, j) => {
      if (j % 2 === 1) {
        return <strong key={`${i}-${j}`} className="font-bold">{bPart}</strong>;
      }
      const italicParts = bPart.split('*');
      return italicParts.map((iPart, k) => {
        if (k % 2 === 1) {
          return <em key={`${i}-${j}-${k}`} className="italic">{iPart}</em>;
        }
        return <span key={`${i}-${j}-${k}`}>{iPart}</span>;
      });
    });
  });
};

const renderParagraphs = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    if (line.trim().startsWith('### ')) {
      return <h3 key={idx} className="text-lg font-bold mt-4 mb-2">{renderText(line.slice(4))}</h3>;
    }
    if (line.trim().startsWith('## ')) {
      return <h2 key={idx} className="text-xl font-bold mt-5 mb-3">{renderText(line.slice(3))}</h2>;
    }
    if (line.trim().startsWith('# ')) {
      return <h1 key={idx} className="text-2xl font-bold mt-6 mb-4">{renderText(line.slice(2))}</h1>;
    }
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return (
        <div key={idx} className="flex gap-2 ml-4 mb-1">
          <span className="text-primary-gold">•</span>
          <span>{renderText(line.slice(2))}</span>
        </div>
      );
    }
    const match = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (match) {
      return (
        <div key={idx} className="flex gap-2 ml-4 mb-1">
          <span className="text-primary-gold font-bold">{match[1]}.</span>
          <span>{renderText(match[2])}</span>
        </div>
      );
    }
    if (line.trim() === '') {
      return <div key={idx} className="h-2"></div>;
    }
    return <div key={idx} className="mb-2">{renderText(line)}</div>;
  });
};

export default function MarkdownMessage({ content }: { content: string }) {
  const blocks = content.split('```');
  
  return (
    <div className="text-sm sm:text-base leading-relaxed space-y-2 w-full break-words">
      {blocks.map((block, index) => {
        if (index % 2 === 1) {
          const lines = block.split('\n');
          const language = lines[0].trim();
          const code = lines.slice(1).join('\n');
          
          return (
            <div key={index} className="rounded-lg bg-black/40 overflow-hidden border border-white/10 my-4 shadow-inner max-w-full">
              {language && (
                <div className="bg-black/60 px-4 py-1.5 text-xs text-white/50 border-b border-white/10 font-mono">
                  {language}
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-sm text-zinc-200 font-mono">
                <code>{code}</code>
              </pre>
            </div>
          );
        } else {
          return (
            <div key={index} className="space-y-1">
              {renderParagraphs(block)}
            </div>
          );
        }
      })}
    </div>
  );
}
