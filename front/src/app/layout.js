export const metadata = {
  title: '여기담다',
  description: '우리 가족의 이야기가 시작되는 곳'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
