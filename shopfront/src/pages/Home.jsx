import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){

    return(
        <div>
            <p>hello</p>
            <nav>
                <ul>
                    <li><Link to="/login">로그인</Link></li>
                    <li><Link to="/signup">회원가입</Link></li>
                </ul>
            </nav>
        </div>
    )
}