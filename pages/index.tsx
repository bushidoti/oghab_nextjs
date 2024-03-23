import React from 'react';
import {Carousel} from 'antd';
import Image from "next/image";



const Home: React.FC = () => (
    <Carousel className='w-full' autoplay effect="fade">
            <Image
                className='object-fill rounded h-[85vh]'
                width={1080}
                priority={true}
                height={1080}
                src={'/1.png'}
                alt=''
            />
            <Image
                className='object-fill rounded h-[85vh]'
                width={3000}
                height={3000}
                src={'/2.png'}
                alt=''
            />
            <Image
                className='object-fill rounded h-[85vh]'
                width={2000}
                height={2000}
                src={'/3.png'}
                alt=''
            />
    </Carousel>
);

export default Home;