'use client';

import { useState } from 'react';
import { ChatWindow } from '@/components/ChatWindow';
import { GuideInfoBox } from '@/components/guide/GuideInfoBox';
import { Select } from '@/components/ui/select';
import { AVAILABLE_USERS } from '@/utils/users';
export default function Home() {
  const [user, setUser] = useState('admin');
  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="text-l">
          🤝
          <span className="ml-2">
            This template showcases a simple RAG chatbot using{' '}
            <a className="text-blue-500" href="https://ts.llamaindex.ai/" target="_blank">
              LlamaIndex.TS
            </a>{' '}
            and
            <a className="text-blue-500" href="https://openfga.dev/" target="_blank">
              OpenFGA
            </a>{' '}
            in a{' '}
            <a className="text-blue-500" href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{' '}
            project.
          </span>
        </li>
        <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
            You can find the prompt and model logic for this use-case in <code>app/api/chat/route.ts</code>.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🎨
          <span className="ml-2">
            The main frontend logic is found in <code>app/page.tsx</code>.
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>What can you help me with?</code> below!
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );

  return (
    <>
      <div className="border border-input bg-background rounded-lg flex flex-col gap-2 max-w-[200px] mx-auto relative my-2 z-10">
        <Select
          className="bg-transparent text-white border border-white/20 rounded relative z-10"
          onChange={(e) => setUser(e.target.value)}
        >
          {AVAILABLE_USERS.map((user) => (
            <option value={user.name} key={user.name} className="bg-gray-900 text-white">
              {user.displayName}
            </option>
          ))}
        </Select>
      </div>
      <ChatWindow
        endpoint={`api/chat?user=${user}`}
        emoji="🤖"
        placeholder={`Hello ${user}, I'm your HR assistant. How can I help you today?`}
        emptyStateComponent={InfoCard}
      />
    </>
  );
}
