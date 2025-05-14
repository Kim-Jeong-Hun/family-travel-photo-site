import './styles/globals.css';
/*
Tailwind CSS에서는 body와 html의 기본 마진을 제거하기 위해 일반적으로 글로벌 스타일을 작성합니다.
Tailwind 자체 클래스는 html, body 같은 태그에 직접 적용할 수 없기 때문에, 아래처럼 globals.css 파일에 작성하는 방식이 일반적입니다.
*/


export const metadata = {
  title: '여기담다 - 우리 가족의 이야기가 시작되는 곳',
  description: '가족 여행 사진 공유 모바일 웹사이트'
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}