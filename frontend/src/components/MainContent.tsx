'use client';

import React from 'react';
import TextInput from './TextInput';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';

const MainContent = () => {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const handleStart = () => {
    if (!topic.trim()) {
      alert('주제를 입력해주세요!');
      return;
    }
    // API를 직접 호출하는 대신, 입력된 주제를 URL에 담아 canvas 페이지로 전달합니다.
    router.push(`/canvas?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6">
      {/* flex-grow를 사용하여 이 컨테이너가 남은 공간을 모두 차지하게 만들어
        ChatInput 컴포넌트를 하단에 고정시키는 효과를 줍니다.
      */}
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400">
          아이디어를 시작하세요.
        </h1>
      </div>
      <TextInput />
    </main>
  );
};

export default MainContent;