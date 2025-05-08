import React, { useMemo, useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(1);
  const [other, setOther] = useState(0);

  // 가벼운 계산 함수로 변경
  const expensive = (num) => {
    console.log('무거운 계산 중...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += num;
    }
    return result;
  };

  // count가 바뀔 때만 expensive 계산 실행
  const memoValue = useMemo(() => expensive(count), [count]);

  return (
    <div>
      <p>count 값: {count}</p>
      <p>계산된 값: {memoValue}</p>
      <button onClick={() => setCount(count + 1)}>count 증가</button>
      <button onClick={() => setOther(other + 1)}>other 증가</button>
    </div>
  );
}

export default MyComponent;
