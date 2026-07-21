import React, { useEffect, useRef, useState } from 'react';
import { Tag, theme } from 'antd';
import { TableOutlined, ColumnWidthOutlined, CodeOutlined ,EnterOutlined } from '@ant-design/icons';
import { buildSuggestions, getCaretCoordinates, getCurrentWord } from '../assets/sqlAutocomplete';
import type { Suggestion, TableInfo } from '../assets/sqlAutocomplete';
import './Auto_Complete.scss';


interface AutoCompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  tables?: TableInfo[];
}

const KIND_CONFIG: Record<Suggestion['kind'], { label: React.ReactNode; color: string; icon: React.ReactNode }> = {
  table: { label: <span>Table <TableOutlined /></span>, color: 'processing', icon: <TableOutlined style={{ color: '#1677ff' }} /> },
  column: { label: <span>Column <ColumnWidthOutlined /></span>, color: 'success', icon: <ColumnWidthOutlined style={{ color: '#52c41a' }} /> },
  keyword: { label: <span>Tab <EnterOutlined /></span>, color: '#09013d', icon: <CodeOutlined style={{ color: '#09013d' }} /> },
};

const NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'];

const Auto_Complete: React.FC<AutoCompleteProps> = ({
  value,
  onChange,
  placeholder,
  className,
  tables = [],
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [wordStart, setWordStart] = useState(0);

  const { token } = theme.useToken();

  useEffect(() => {
    if (listRef.current && suggestions.length > 0) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex, suggestions]);

  const refreshSuggestions = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const caretPos = textarea.selectionStart;
    const { word, start } = getCurrentWord(textarea.value, caretPos);
    if (!word) {
      setSuggestions([]);
      return;
    }
    const textBeforeWord = textarea.value.slice(0, start);
    const results = buildSuggestions(word, textBeforeWord, tables);
    setActiveIndex(0);
    setWordStart(start);
    setSuggestions(results);
    if (results.length > 0) {
      const caret = getCaretCoordinates(textarea, caretPos);
      const left = Math.max(0, Math.min(caret.left, textarea.clientWidth - 260));
      setPosition({
        top: caret.top + textarea.offsetTop,
        left: left + textarea.offsetLeft,
      });
    }
  };

  const applySuggestion = (suggestion: Suggestion) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const caretPos = textarea.selectionStart;
    const next = `${value.slice(0, wordStart)}${suggestion.value}${value.slice(caretPos)}`;
    onChange(next);
    setSuggestions([]);
    const cursor = wordStart + suggestion.value.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    refreshSuggestions();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      applySuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!NAV_KEYS.includes(e.key)) {
      refreshSuggestions();
    }
  };

  return (
    <div className="sql-autocomplete-container">
      <textarea
        ref={textareaRef}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={refreshSuggestions}
        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
      />
      {suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="sql-autocomplete__list"
          style={{
            top: position.top,
            left: position.left,
            backgroundColor: token.colorBgElevated,
            borderColor: token.colorBorderSecondary,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
          }}
        >
          {suggestions.map((s, i) => {
            const config = KIND_CONFIG[s.kind];
            const isActive = i === activeIndex;
            return (
              <li
                key={`${s.kind}-${s.value}`}
                className={isActive ? 'active' : undefined}
                style={{
                  backgroundColor: isActive ? token.controlItemBgHover : 'transparent',
                  color: isActive ? token.colorPrimary : token.colorText,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applySuggestion(s);
                }}
              >
                <div className="sql-autocomplete__left">
                  <span className="sql-autocomplete__icon">{config.icon}</span>
                  <span className="sql-autocomplete__value">{s.value}</span>
                  {s.detail && (
                    <span className="sql-autocomplete__detail" style={{ color: token.colorTextDescription }}>
                      ({s.detail})
                    </span>
                  )}
                </div>
                <Tag color={config.color} bordered={false} className="sql-autocomplete__tag">
                  {config.label}
                </Tag>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Auto_Complete;
