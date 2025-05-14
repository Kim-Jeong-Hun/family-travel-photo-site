"use client";

function LoginForm() {
  return (
    <div>
      <div className="h-screen w-full bg-[url('/images/login-bg.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="p-8 w-[75%] max-w-sm h-[80%] text-center">
          <div className="">
            <img
              src="/images/login-logo.png"
              alt="여기담다"
              className="w-20 mx-auto"
            />
          </div>

          <div className="flex flex-col gap-4 mt-[25%]">
            <input 
              type="email" 
              placeholder="아이디" 
              className="outline-none"
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="outline-none"
            />

            <div className="text-white text-sm">
              <a href="/register" className="underline">
                회원가입
              </a>{" "}
              /{" "}
              <a href="/find-password" className="underline">
                비밀번호 찾기
              </a>
            </div>
            <button className="mt-2 bg-yellow-400 hover:bg-yellow-300 transition rounded-full py-3">
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

/*고쳐야하는 오류
2. 모든 DOM 요소들 스타일 적용 안됨.
  2.1. 레이아웃 적용
  2.2. 스타일 적용 (입력폼, 버튼 스타일)
*/
