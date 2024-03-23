import {
   UserOutlined,
} from '@ant-design/icons';
import {Avatar, Layout} from 'antd';
import React, {useState} from "react";
import {MenuLayout} from "./menu_items";
import {useSession} from "next-auth/react";
import {Loading} from "@/components/loading/loading";
import {Banner} from "@/components/layout/banner";

const {Content, Sider} = Layout;




export default function LayoutForm({ children, data }: any) {
    const [siderW , setSiderW] = useState<number>()
    const [breakP , setBreakP] = useState<boolean>()
    const {data : session , status }:any =useSession()

    return (
        <>
                {status === 'authenticated' ?
                     <Banner/>
                    :
                null
                }
            <Layout>
                {status === 'authenticated' ?
                    <>
                            <Sider breakpoint="xl" width={siderW}
                                   className={breakP ? '!fixed  !z-[99] !h-[100vh] top-0 right-0  bottom-0' : ''} collapsedWidth={0}
                                   onBreakpoint={broken => {
                                       if (broken) {
                                           setSiderW(300)
                                           setBreakP(true)
                                       } else {
                                           setSiderW(200)
                                           setBreakP(false)
                                       }
                                   }}>
                                <div className='flex flex-col items-center m-5'>
                                    <Avatar className='bg-sky-500' size={100} icon={<UserOutlined/>}/>
                                    <p className='text-gray-50'>{session.full_name}</p>
                                    <p className='text-gray-50'>{session.office}</p>
                                </div>
                                <MenuLayout/>
                            </Sider>
                        <Layout>
                        <Content className='p-2 h-[100%]' style={{overflow: 'initial'}}>
                                    <div className='bg-white rounded min-h-[100vh]' style={{padding: 24}}>
                                        <main>{children}</main>
                                    </div>
                                </Content>
                            </Layout>
                    </>
                    :
                    <main>{children}</main>
                }
                {status === 'loading' ?
                    <Loading/>
                    :
                    ''
                }
            </Layout>
        </>
    );
};
