import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Form, Input, message, Space} from 'antd';
import { useRouter } from 'next/navigation'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getCsrfToken } from "next-auth/react"

export default function Login({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const success = () => {
        message.success(' خوش آمدید');
    };

    const error = () => {
        message.error('نام کاربری یا رمز عبور اشتباه است');
    };

    return (
        <div className='grid h-screen place-items-center bg-sky-200'>
            <div
                className='sm:w-[50vw] lg:w-[30vw] mobile:w-[70vw] md:w-[40vw] shadow-2xl shadow-indigo-500/50 bg-cyan-50 p-[2vw] rounded-[25px]  border-[25px]'>
                <div className='flex flex-col items-center mb-5'>
                    <Avatar shape="square" src={'icon-512.png'} size={100}/>
                </div>

                <form method="post"  action="/api/auth/callback/credentials">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken}/>
                      <Space size={25} direction="vertical" className='w-full'>
                        <Input  className='message-login'
                        name='username' prefix={<UserOutlined className="site-form-item-icon"/>}
                        placeholder="نام کاربری" required={true}/>
                     <Input.Password
                            name='password'
                            className='message-login'
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="رمز عبور"
                            required={true}
                        />
                       <Button type="primary" htmlType="submit" className="mt-10 mb-2 w-full">
                        ورود
                       </Button>
                      </Space>
                </form>
                <div className='text-center text-sm'>v2.0.0</div>
            </div>
        </div>
    );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}