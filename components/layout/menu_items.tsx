import {Menu, MenuProps} from "antd";
import {
    BarChartOutlined,
    CloudSyncOutlined, FileOutlined,
    HomeOutlined,
    PieChartOutlined,
    PoweroffOutlined, SolutionOutlined,
} from '@ant-design/icons';
import React, {useState} from "react";
import {DownloadOutlined} from "@mui/icons-material";
import Link from "next/link";
import {useRouter} from "next/router";
import { signOut, useSession } from "next-auth/react";




type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] ,
    disabled?: boolean,
    danger?: boolean ,


): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        disabled,
        danger,


    } as MenuItem;
}

const rootSubmenuKeys = ['sub1', 'sub4', 'sub5'];


export const MenuLayout = () => {
  const [openKeys, setOpenKeys] = useState(['']);
  const router = useRouter();
  const path = router.pathname;
  const {data : session , status }:any =useSession()




  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
          setOpenKeys(keys);
        } else {
          setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
      };

  const items: MenuItem[] = [
    getItem(<Link href='/'>خانه</Link>, '/', <HomeOutlined/>),
    getItem('مدیریت قراردادها', 'sub1', <SolutionOutlined/>, [

        getItem('قراردادها', '/contract', null, [
            getItem(<Link href='../contract/register' style={!['Can add document'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت</Link>, '/contract/register',undefined,undefined,!['Can add document'].some((element: any) => session.perm_tuple?.includes(element))),
            getItem(<Link href='/contract'>گزارش</Link>, '/contract/report'),
            getItem(<Link href='../contract/upload' style={!['Can change document'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری قرارداد</Link>, '/contract/upload',undefined,undefined,!['Can change document'].some((element: any) => session.perm_tuple?.includes(element))),
        ]),

        getItem(<Link href='../personal'>مدارک اشخاص</Link>, '/personal', null, [
            getItem(<Link href='../personal/register' style={!['Can add person'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت</Link>, '/personal/register',undefined,undefined,!['Can add person'].some((element: any) => session.perm_tuple?.includes(element))),
            getItem(<Link href='../personal/report'>گزارش</Link>, '/personal/report'),
            getItem(<Link href='../personal/upload' style={!['Can change person'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری مدارک</Link>, '/personal/upload',undefined,undefined,!['Can change person'].some((element: any) => session.perm_tuple?.includes(element))),
        ]),
    ], !['Can view document', 'Can view person'].some((element: any) => session.perm_tuple?.includes(element))),

       getItem('مدیریت اسناد', 'sub4', <FileOutlined/>, [
        getItem(<Link href='../document/register' style={!['Can add immovable', 'Can add movable'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت اسناد اموال</Link>, '/document/register',undefined
        ,undefined,!['Can add immovable', 'Can add movable'].some((element: any) => session.perm_tuple?.includes(element))),
        getItem(<Link href='../document/report'>گزارش اسناد</Link>, '/document/report'),
        getItem(<Link href='../document/upload' style={!['Can change immovable', 'Can change movable'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری اسناد</Link>, '/document/upload',undefined,undefined,!['Can change immovable', 'Can change movable'].some((element: any) => session.perm_tuple?.includes(element)))
    ],!['Can view immovable', 'Can view movable'].some((element: any) => session.perm_tuple?.includes(element))),

    getItem('انبارداری', 'sub5', <BarChartOutlined/>, [
        getItem(<Link href='../warhouse/product'>انبار</Link>, '/warhouse/product', null, [
            getItem(<Link href='../warhouse/product/register' style={!['Can add product'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت</Link>, '/warhouse/product/register' ,undefined,undefined,!['Can add product'].some((element: any) => session.perm_tuple?.includes(element))),
            getItem(<Link href='../warhouse/product/report'>گزارش</Link>, '/warhouse/product/report'),
            getItem(<Link href='../warhouse/product/upload' style={!['Can change product'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری مدارک</Link>, '/warhouse/product/upload',undefined,undefined,!['Can change product'].some((element: any) => session.perm_tuple?.includes(element))),
        ]),
        getItem(<Link href='../warhouse/property'>اموال</Link>, '/warhouse/property', null, [
            getItem(<Link href='../warhouse/property/register' style={!['Can add property'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت</Link>, '/warhouse/property/register',undefined,undefined,!['Can add property'].some((element: any) => session.perm_tuple?.includes(element))),
            getItem(<Link href='../warhouse/property/report'>گزارش</Link>, '/warhouse/property/report'),
            getItem(<Link href='../warhouse/property/sent'>ارسالی</Link>, '/warhouse/property/sent'),
            getItem(<Link href='../warhouse/property/upload' style={!['Can change property'].some((element: any) => session.perm_tuple?.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری فاکتور</Link>, '/warhouse/property/upload',undefined,undefined,!['Can change property'].some((element: any) => session.perm_tuple?.includes(element))),
        ]),
    ] , !['Can view property', 'Can view product'].some((element: any) => session.perm_tuple?.includes(element))),
     getItem(<Link target={"_blank"} style={session.rank !== 'مدیر' ? {pointerEvents:'none'} : {}} href='https://api.oghab-asaluyeh.ir/admin/'>پنل مدیریت</Link>, '2', <PieChartOutlined/> ,  undefined , session.rank !== 'مدیر'),
    getItem(<Link target={"_blank"} style={session.rank !== 'مدیر' ? {pointerEvents:'none'} : {}} href='http://www.oghab-asaluyeh.ir:2082/cpsess6008508683/frontend/
  jupiter/backup/wizard-backup-type.html?login=1&post_login=3837540636687'>بکاپ</Link>
        , '3', <CloudSyncOutlined/> ,  undefined , session.rank !== 'مدیر'),
    getItem(<a href='https://www.oghab-asaluyeh.ir/scanner.zip'>دانلود اسکنر</a>, '21', <DownloadOutlined/>,undefined,undefined),
    getItem(<Link  href="/api/auth/signout"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut()
                  }}>خروج</Link>, '22', <PoweroffOutlined/>,undefined,undefined,true),
];
    return (
         <Menu
            theme="dark"
            className='!overflow-auto sm:max-h-[50vh] lg:max-h-[60vh] md:max-h-[55vh] xl:max-h-[100vh] 2xl:max-h-[100vh]'
            defaultSelectedKeys={[path]}
            mode="inline"
            items={items}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
         />
    )
}