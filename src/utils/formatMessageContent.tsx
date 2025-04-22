import React from "react";

export function formatMessageContent(content: string): React.ReactElement {
  const lines = content.split('\n');

  const elements: React.ReactElement[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul className="list-disc pr-4 mb-2" dir="rtl" key={`list-${elements.length}`}>
          {listItems.map((item, i) => (
            <li
              key={`li-${i}`}
              dangerouslySetInnerHTML={{ __html: formatInline(item) }}
            />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const formatInline = (text: string): string => {
    return text
      // Convert **bold**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert *italic*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert URLs
      .replace(
        /((https?:\/\/|www\.)[^\s]+)/g,
        (url) => {
          const href = url.startsWith('http') ? url : `https://${url}`;
          return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${url}</a>`;
        }
      );
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      flushList();
      elements.push(<br key={`br-${index}`} />);
    } else if (trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList();
      elements.push(
        <p
          key={`p-${index}`}
          className="mb-2 leading-relaxed"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    }
  });

  flushList();

  return <div>{elements}</div>;
}
