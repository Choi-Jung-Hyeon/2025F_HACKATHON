'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import React from 'react';

// MainContent로부터 받을 props들의 타입을 정의합니다.
interface TextInputProps {
  topic: string;
  setTopic: (value: string) => void;
  onStart: () => void;
}

const TextInput = ({ topic, setTopic, onStart }: TextInputProps) => {
  return (
    <div className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder="아이디어의 씨앗을 심어보세요 (예: 고립)"
        className="h-12 text-lg"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onStart();
          }
        }}
      />
      <Button type="submit" className="h-12 px-6" onClick={onStart}>
        시작하기
      </Button>
    </div>
  );
};

export default TextInput;