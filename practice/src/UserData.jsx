import React, { useEffect, useState } from 'react';

function UserData() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 한 번 실행됨
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []); // 빈 배열이면 "한 번만" 실행됨

  return user ? <div>{user.name}</div> : <div>로딩 중...</div>;
}

export default UserData;