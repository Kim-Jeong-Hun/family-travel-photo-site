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
