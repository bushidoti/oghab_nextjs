import "@/styles/globals.css";
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import theme from '@/components/theme/themeConfig';
import LayoutForm from "@/components/layout/layout";
import fa_IR from "antd/lib/locale/fa_IR";
import {SessionProvider} from "next-auth/react";



const App = ({ Component, pageProps : { session, ...pageProps } }: AppProps) => {
    return (
          <ConfigProvider  locale={fa_IR} direction="rtl" theme={theme}>
                  <SessionProvider session={session}>
                       <LayoutForm>
                          <Component {...pageProps} />
                       </LayoutForm>
                  </SessionProvider>
          </ConfigProvider>
    )
}

export default App;

