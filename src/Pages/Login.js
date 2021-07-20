import { useState, useEffect} from 'react';
import 'antd/dist/antd.css';
import '../static/Login.css';

import { Card, Input, Button ,Spin, message } from 'antd';
import { UserOutlined,LockOutlined } from '@ant-design/icons';

import servicePath from '../config/apiUrl';
import axios from "axios"

const Login = (props) => {

    //console.log("Loin---props",props)

    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{

    },[])

    const checkLogin = ()=>{

        setIsLoading(true)

        if(!userName){
           message.error("userName can not be empty!")
           return false;
        }else if(!password){
            message.error("password can not be empty!")
            return false;
        }

        let dataProps={
            userName:userName,
            password:password
        }

        axios({
            method:"post",
            url:servicePath.checkLogin,
            data:dataProps,
            //withCredentials:true // front and back share the same session
        }).then(
            (res) => {
                console.log("Login---res---",res)
                setIsLoading(false)
                if(res.data.data==="login success"){
                    localStorage.setItem('openId',res.data.openId)
                    props.history.push('/index')
                }else{
                    message.error("userName or password is incorrect!")
                }
            }
        )

        setTimeout(()=>{
            setIsLoading(false)
        },1000)
    }

    return ( 
        <div className="login-div">

            <Spin tip="Loading..." spinning={isLoading}>
                <Card title="Login page here" bordered={true} style={{ width: 400 }} >
                    <Input
                        id="userName"
                        size="large"
                        placeholder="Enter your userName"
                        prefix={<UserOutlined style={{color:'rgba(0,0,0,.25)'}}/>}
                        onChange={(e)=>{setUserName(e.target.value)}}
                    /> 
                    <br/><br/>
                    <Input.Password
                        id="password"
                        size="large"
                        placeholder="Enter your password"
                        prefix={<LockOutlined style={{color:'rgba(0,0,0,.25)'}}/>}
                        onChange={(e)=>{setPassword(e.target.value)}}
                    />     
                    <br/><br/>
                    <Button type="primary" size="large" block onClick={checkLogin} > Login in </Button>
                </Card>
            </Spin>
        </div>
     );
}
 
export default Login;   