"use client";
import { useState, React } from 'react';

function Settings_page() {
    
    const handleSubmit = (event) => {
        event.preventDefault();
    }



    /* html 태그 만든 후 -> react로 변환 -> css 적용 -> javascript 및 이벤트 핸들러, 라이브러리 적용 */
    return (
        <div>
            <div>
                <form action="post">
                    <div>
                        <p><h3>테마</h3></p>
                        <input type="radio" name="theme"/>
                        <input type="radio" name="theme"/>
                        <input type="radio" name="theme"/>
                    </div>
                    <div>
                        <p><h3>기본 언어 설정</h3></p>
                        <select name="languages" id="lang">
                            <option value="korean">한국어</option>
                            <option value="english">English</option>
                            <option value="japanese">日本語</option>
                            <option value="spanish">español</option>
                        </select>
                        <input type="submit" value="저장하기"/>
                    </div>
                </form>
                    <div class="">
                        <p><h4>About</h4></p>
                        <p><h4>App Version</h4></p>
                        <p><h4>1.0.0</h4></p>
                    </div>
            </div>
        </div>
    );
}

export default Settings_page;