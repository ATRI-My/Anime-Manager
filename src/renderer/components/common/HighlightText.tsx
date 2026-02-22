import React from 'react';

interface HighlightTextProps {
  text: string;
  highlight: string;
  caseSensitive?: boolean;
  className?: string;
  highlightClassName?: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  highlight,
  caseSensitive = false,
  className = '',
  highlightClassName = 'bg-yellow-200'
}) => {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const escapedHighlight = escapeRegExp(highlight);
  const regex = new RegExp(`(${escapedHighlight})`, caseSensitive ? 'g' : 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isHighlight = regex.test(part);
        regex.lastIndex = 0;
        
        return isHighlight ? (
          <span key={index} className={highlightClassName}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
};

export default HighlightText;