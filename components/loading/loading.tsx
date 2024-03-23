import {Flex, Image, Spin} from "antd";

export const Loading = () => {
    return (
        <div className='loading absolute w-full'>
            <div>
                  <Flex vertical justify={"center"} align={"center"}>
                     <Image preview={false} src={'icon.png'} alt='Loading ....'/>
                     <Spin size="large" />
                  </Flex>
            </div>
        </div>
    )
}