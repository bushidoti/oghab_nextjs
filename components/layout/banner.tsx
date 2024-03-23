import { Space } from "antd";
import Marquee from "react-fast-marquee";
import React, {useEffect, useState} from "react";
import Url from "../api-configue";
import axios from "axios";
import {useSession} from "next-auth/react";


export const Banner = () => {
    let today = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    const day = new Date().toLocaleString('fa-IR', {  weekday: 'long' })
    const [message , setMessage] = useState<any>('')
    const [event , setEvent] = useState<any>([])
    const {data : session}:any =useSession()

    useEffect(() => {
            (async () => {

                const {data} = (await axios.get(`${Url}/api/banner`, {
                    headers: {
                        'Authorization': 'Bearer ' + session.access,
                    }
                }));
                setMessage(data[0].message);
            })().then(
                async () => {
                const {data} = (await axios.get(`${Url}/date`, {
                    headers: {
                        'Authorization': 'Bearer ' + session.access,
                    }
                }));
                     setEvent(data.message.events)
            }
            )
    }, [session]);


    return (
          <Marquee direction={"right"} speed={100} className='bg-amber-100' pauseOnHover gradient={false}>
              <Space size={500}>
                  {
                      event.map((data: any , i : number) => (
                          <p className={'ms-[200px]'} key={i}>
                              {`رویداد امروز :  ${data?.description}`}
                          </p>
                      ))
                  }
                    {
                      [`امروز ${day} , ${today}`,message].map((data: string, index: number) => (
                          <p className={`me-4 ${index === 1 ? 'text-red-800' : null }`} key={data}>
                               {data}
                          </p>
                      ))
                  }

              </Space>
          </Marquee>
    )
}