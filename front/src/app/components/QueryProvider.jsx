'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }) {
  // QueryClient 인스턴스를 useState로 감싸서 한 번만 생성되게 합니다.
  // useState의 의미 : 참조 유지 (최초 렌더링 시점에 생성된 값을 메모리의 특정 공간에 저장해두고, 재실행 시 그 값을 그대로 반환)
  // 화살표 함수의 이유 : 최초 1회만 객체를 생성하도록 강제하여 불필요한 리소스 소모 막음.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}