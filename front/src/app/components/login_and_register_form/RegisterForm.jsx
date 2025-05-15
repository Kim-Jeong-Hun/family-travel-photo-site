"use client";

function RegisterForm() {
  return (
    <div className="bg-white opacity-80 z-[10]">
      <div className="h-screen w-full bg-[url('/images/login-bg.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="p-8 mb-[5%] w-[75%] max-w-sm h-[80%] text-center">
          <div className="">
            <img
              src="/images/login-logo.png"
              alt="여기담다"
              className="w-20 mx-auto"
            />
          </div>

          <div className="flex flex-col gap-4 mt-[15%] items-center justify-center">
            <form name="loginform" method="get" action="">
              <input
                type="email"
                placeholder="아이디"
                className="w-[280px] h-[40px] mt-[10px] mb-[10px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="w-[280px] h-[40px] mb-[10px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              <input
                type="password"
                placeholder="비밀번호확인"
                className="w-[280px] h-[40px] mb-[10px] px-[10px] text-[16px] text-[#333] bg-white border border-[#ccc] rounded outline-none box-border flex justify-center items-center"
              />
              <div>
                <a href="/login" className="underline text-[#FFF]">
                  로그인하기
                </a>
              </div>
              <input
                type="submit"
                value="회원가입"
                className="mt-[30px] w-[280px] h-[45px] bg-[#ffe500] border-none rounded-[30px] text-[16px] font-bold text-black cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#ffdd00]"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;

/*
아이디, 비밀번호, 비밀번호 확인 입력창이 움직이므로
위에서 mt을 주는 방식이 아니라 로그인, 회원가입 버튼 아래에서 mb을 주는 방식으로 바꾸고
다시 레이아웃 짜야 함. - 2025.05.15
*/