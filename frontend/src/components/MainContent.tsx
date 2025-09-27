'use client';

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
    <main className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-5xl font-bold mb-4">안녕하세요!</h1>
        <p className="text-xl text-gray-500 mb-8">
          어떤 주제에 대해 생각을 확장해 볼까요?
        </p>

        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="아이디어의 씨앗을 심어보세요 (예: 고립)"
            className="h-12 text-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
          <Button type="submit" className="h-12 px-6" onClick={handleStart}>
            시작하기
          </Button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;