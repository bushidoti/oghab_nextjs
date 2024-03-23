import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
   components: {
            Layout: {
                triggerColor:'rgb(14 165 233)',
                bodyBg:'#daeaf7',
                headerBg:'#4fa5d8',
                siderBg:'#00022b',
                footerBg:'#4fa5d8',
            },
            Divider: {
                colorSplit: '#69b1ff'
            },Menu: {
                colorBgContainer: '#69b1ff',
                darkItemBg: '#00022b',
                darkItemColor: '#69b1ff',
                subMenuItemBg:'#69b1ff',
                iconSize:20,
                itemMarginBlock:8,
                darkItemSelectedBg: '#0855b1',
                darkSubMenuItemBg: '#010e54',
                darkItemHoverBg	: '#daeaf7',
                darkItemHoverColor	: '#00022b',
            }
        }
};

export default theme;