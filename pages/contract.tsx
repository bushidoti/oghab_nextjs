import {SearchOutlined} from '@ant-design/icons';
import React, {useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import {InputRef, TableProps, Tooltip} from 'antd';
import {Badge, Button, Input, Select, Space, Table} from 'antd';
import type {ColumnsType, ColumnType} from 'antd/es/table';
import type {FilterConfirmProps, FilterValue, SorterResult} from 'antd/es/table/interface';
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import {useReactToPrint} from "react-to-print";
import TablePrint from "@/components/contract/main/table";
import Url from "@/components/api-configue";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import {GetServerSidePropsContext} from "next";

interface DataType {
    key: React.Key;
    id: number;
    type_form: string;
    goodPrice: string;
    typeBail1: string;
    name: string;
    typeContract: string;
    firstBail2: string;
    secondBail2: string;
    typeBail2: string;
    office: string;
    topicContract: string;
    dateContract: string;
    contractPrice: string;
    prePaidPrice: string;
    commitmentPrice: string;
    typeBail: string;
    contractNumber: string;
    firstBail: string;
    secondBail: string;
    expireDate: string;
    clearedDate: string;
    clearedStatus: boolean;
    receivedDocument: boolean;
    affidavitStatus: boolean;
}


type DataIndex = keyof DataType;






export default function MainContract({ data } : any) {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const navigate = useRouter();
    const {data : session} =useSession()
    const [pagination, setPagination] = useState<any>({
        current:1,
        pageSize:10
    })
    const [loading, setLoading] = useState<boolean>();
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
    const [filteredColumns, setFilteredColumns] = useState<string[]>([])
    const componentPDF = useRef(null);
    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "اشخاص",
    });



    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const handleSearchPlaceHolder = (dataIndex: DataIndex) => {

        if (dataIndex === "id") {
            return 'کد ثبت'
        } else if (dataIndex === "name") {
            return 'نام و نشانی'
        } else if (dataIndex === "typeContract") {
            return 'نوع قرارداد'
        } else if (dataIndex === "contractNumber") {
            return 'شماره قرارداد'
        } else if (dataIndex === "topicContract") {
            return 'موضوع قرارداد'
        }

    }

    const handleTypeFirstBail = (type: string) => {

        if (type === "چک") {
            return 'شماره چک'
        } else if (type === "نقد") {
            return 'واریز به حساب'
        } else if (type === "سفته") {
            return 'تعداد سفته'
        } else if (type === "بانک") {
            return 'ضمانت'
        } else if (type === "تعهد") {
            return 'موضوع تعهد'
        }

    }


    const handleTypeSecondBail = (type: string) => {

        if (type === "چک") {
            return 'بانک'
        } else if (type === "نقد") {
            return 'شماره حساب'
        } else if (type === "سفته") {
            return 'مبلغ سفته'
        } else if (type === "بانک") {
            return 'شماره تضمین'
        } else if (type === "تعهد") {
            return 'شماره تعهد'
        }

    }


    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (

            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>

                {dataIndex === "dateContract" ?
                    <>
                        <JalaliLocaleListener/>
                        <DatePickerJalali
                            onChange={function (dateString: string) {
                                setSelectedKeys(dayjs(dateString).locale('fa').format('YYYY-MM-DD') ? [dayjs(dateString).locale('fa').format('YYYY-MM-DD')] : [])
                            }}
                            onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        />
                    </>

                    :
                    <Input
                        ref={searchInput}
                        placeholder={`جستجو ${handleSearchPlaceHolder(dataIndex)}`}
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }}
                        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        style={{marginBottom: 8, display: 'block'}}
                    />
                }


                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        جستجو
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        تنظیم مجدد
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        فیلتر
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        بستن
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


     const columns: ColumnsType<DataType> = [
         {
            align: "center",
            title: 'نام و نشانی',
            fixed: 'left',
            dataIndex: 'name',
            width: '7%',
             ellipsis: {
              showTitle: false,
            },
            key: 'name',
            ...getColumnSearchProps('name'),
            filteredValue: filteredInfo.name || null,
            render: (_value, record) =>
              <Tooltip placement="topLeft" title={record.name}>
                <Button type={"link"} onClick={() => {
                navigate.push(`/contract/edit/${record.id}`)
            }}>{record.name}</Button>
              </Tooltip>,
        }, {
            align: "center",
            title: 'شماره قرارداد',
            width: '6.30%',
            dataIndex: 'contractNumber',
            key: 'contractNumber',
             ellipsis: {
              showTitle: false,
            },
            filteredValue: filteredInfo.contractNumber || null,
            ...getColumnSearchProps('contractNumber'),
             render: (_value, record) => (
              <Tooltip placement="topLeft" title={record.contractNumber}>
                {record.contractNumber}
              </Tooltip>
            ),
        },{
            align: "center",
            title: 'شماره ثبت',
            dataIndex: 'id',
            width: '6.30%',
            key: 'id',
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
            sortDirections: ['descend', 'ascend'],
            filteredValue: filteredInfo.id || null,
            render: (_value, record) =>
                <>
                    {(() => {
                        if (record.clearedStatus) {
                            return (
                                <Space>
                                    <Badge color="green" status="processing"/> {record.id}
                                </Space>
                            )
                        } else {
                            return record.id
                        }
                    })()}
                </>
        }, {
            align: "center",
            title: 'فرم',
            dataIndex: 'type_form',
            width: '5%',
            key: 'type_form',
            filters: [
                {
                    text: 'کارفرما',
                    value: 'کارفرما',
                }, {
                    text: 'پیمانکار',
                    value: 'پیمانکار',
                }
            ],
            filteredValue: filteredInfo.type_form || null,
            onFilter: (value, record) => record.type_form === value,

        }, {
            align: "center",
            title: 'تاریخ قرارداد',
            dataIndex: 'dateContract',
            width: '6%',
            key: 'date',
            ...getColumnSearchProps('dateContract'),
            filteredValue: filteredInfo.dateContract || null,

        }, {
            align: "center",
            title: 'نوع قرارداد',
            width: '6%',
            dataIndex: 'typeContract',
            key: 'typeContract',
            ...getColumnSearchProps('typeContract'),
            filteredValue: filteredInfo.typeContract || null,

        }, {
            align: "center",
            title: 'موضوع قرارداد',
            width: '7%',
            ellipsis: {
              showTitle: false,
            },
            dataIndex: 'topicContract',
            key: 'topicContract',
            ...getColumnSearchProps('topicContract'),
            filteredValue: filteredInfo.topicContract || null,
             render: (_value, record) => (
              <Tooltip placement="topLeft" title={record.topicContract}>
                {record.topicContract}
              </Tooltip>
            ),
        }, {
            align: "center",
            title: 'مبلغ قرارداد',
            dataIndex: 'contractPrice',
            width: '7%',
            key: 'contractPrice',
        }, {
            align: "center",
            title: 'مبلغ پیش پرداخت',
            dataIndex: 'prePaidPrice',
            width: '7%',
            key: 'prePaidPrice',
        }, {
            align: "center",
            title: 'مبلغ حسن انجام کار',
            width: '7%',
            dataIndex: 'goodPrice',
            key: 'goodPrice',

        }, {
            align: "center",
            title: 'وثیقه حسن انجام کار',
            width: '8%',
            dataIndex: 'typeBail1',
            key: 'typeBail1',
            filters: [
                {
                    text: 'چک',
                    value: 'چک',
                }, {
                    text: 'نقد',
                    value: 'نقد',
                }, {
                    text: 'سفته',
                    value: 'سفته',
                }, {
                    text: 'بانک',
                    value: 'بانک',
                }, {
                    text: 'تعهد',
                    value: 'تعهد',
                }
            ],
            filteredValue: filteredInfo.typeBail1 || null,
            onFilter: (value, record) => record.typeBail1 === value,
        }, {
            align: "center",
            title: 'مشخصه وثیقه حسن انجام کار',
            dataIndex: 'Bails',
            children: [
                {
                    dataIndex: 'firstBail',
                    key: 'firstBail',
                    align: "center",
                    width: '10%',
                    render: (_value, record) => handleTypeFirstBail(record.typeBail1) + ' : ' + record.firstBail,

                }, {
                    dataIndex: 'secondBail',
                    key: 'secondBail',
                    align: "center",
                    width: '10%',
                    render: (_value, record) => handleTypeSecondBail(record.typeBail1) + ' : ' + record.secondBail,
                }
            ],
        }, {
            align: "center",
            title: 'مبلغ تعهد انجام کار',
            width: '7%',
            dataIndex: 'commitmentPrice',
            key: 'commitmentPrice',

        }, {
            align: "center",
            title: 'وثیقه تعهد انجام کار',
            width: '8%',
            dataIndex: 'typeBail2',
            key: 'typeBail2',
            filters: [
                {
                    text: 'چک',
                    value: 'چک',
                }, {
                    text: 'نقد',
                    value: 'نقد',
                }, {
                    text: 'سفته',
                    value: 'سفته',
                }, {
                    text: 'بانک',
                    value: 'بانک',
                }, {
                    text: 'تعهد',
                    value: 'تعهد',
                }
            ],
            filteredValue: filteredInfo.typeBail2 || null,
            onFilter: (value, record) => record.typeBail2 === value,
        }, {
            align: "center",
            title: 'مشخصه وثیقه تعهد انجام کار',
            dataIndex: 'Bails',
            children: [
                {
                    dataIndex: 'firstBail2',
                    key: 'firstBail2',
                    align: "center",
                    width: '10%',
                    render: (_value, record) => handleTypeFirstBail(record.typeBail2) + ' : ' + record.firstBail2,

                }, {
                    dataIndex: 'secondBail2',
                    key: 'secondBail2',
                    align: "center",
                    width: '10%',
                    render: (_value, record) => handleTypeSecondBail(record.typeBail2) + ' : ' + record.secondBail2,
                }
            ],
        }, {
            align: "center",
            title: 'وضعیت تسویه',
            width: '7%',
            dataIndex: 'clearedStatus',
            key: 'clearedStatus',
            filters: [
                {
                    text: 'قراردادهای تسفیه شده',
                    value: true,
                }
            ],
            filteredValue: filteredInfo.clearedStatus || null,
            onFilter: (_value, record) =>
                record.clearedStatus,
            render: (_value, record) => record.clearedStatus ?
                <Badge status="success"/> : <Badge status="error"/>,
        }, {
            align: "center",
            title: 'تاریخ تسویه',
            width: '7%',
            dataIndex: 'clearedDate',
            key: 'clearedDate',
        }, {
            align: "center",
            title: 'وضعیت مدرک',
            width: '7%',
            dataIndex: 'receivedDocument',
            key: 'receivedDocument',
            render: (_value, record) => record.receivedDocument ? <Badge status="success"/> : <Badge status="error"/>,

        }, {
            align: "center",
            title: 'محل کار',
            width: '6%',
            fixed: 'right',
            dataIndex: 'office',
            key: 'office',
            filters: [
                {
                    text: 'دفتر مرکزی',
                    value: 'دفتر مرکزی',
                }, {
                    text: 'چابهار',
                    value: 'چابهار',
                }, {
                    text: 'دزفول',
                    value: 'دزفول',
                }, {
                    text: 'جاسک',
                    value: 'جاسک',
                }, {
                    text: 'بیشه کلا',
                    value: 'بیشه کلا',
                }, {
                    text: 'اورهال تهران',
                    value: 'اورهال تهران',
                }, {
                    text: 'اورهال اصفهان',
                    value: 'اورهال اصفهان',
                },
            ],
            filteredValue: (session?.rank === 'مدیر اداری' || session?.rank === 'مشاهده') ? filteredInfo.office  : [session?.office || ''],
            onFilter: (value, record) => record.office === value,

        }
    ];

    const clearFilters = () => {
        setFilteredInfo({});
    };

    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };

    const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter as SorterResult<DataType>);
        setPagination(pagination);
    };


    const onChange = (value: string[]) => {
        setFilteredColumns(value as string[])
    };


    const options = [
        {label: 'شماره پرونده', value: 'caseNumber'},
        {label: 'جنسیت', value: 'sex'},
        {label: 'تاریخ استخدام', value: 'date'},
        {label: 'کد ملی', value: 'national_id'},
        {label: 'شغل', value: 'job'},
        {label: 'تضمین مصوب', value: 'approvedPrice'},
        {label: 'مبلغ تضمین', value: 'commitmentPrice'},
        {label: 'وثیقه تضمین', value: 'typeBail'},
        {label: 'مشخصه وثیقه', value: 'Bails'},
        {label: 'تاریخ پایان قرارداد', value: 'expireDate'},
        {label: 'وضعیت تسویه', value: 'clearedStatus'},
        {label: 'تاریخ تسویه', value: 'clearedDate'},
        {label: 'وضعیت مدرک', value: 'receivedDocument'},
        {label: 'وضعیت اقرارنامه', value: 'affidavitStatus'},
    ];


    return (
        <>
            <Space style={{marginBottom: 16}}>
                <Badge color="green" status="processing" text="به معنی تسویه شده"/>
                <Button onClick={clearFilters}>پاک کردن فیتلر ها</Button>
                <Button onClick={clearAll}>پاک کردن فیلتر و مرتب کننده ها</Button>
                <Button onClick={generatePDF}>چاپ</Button>
            </Space>
            <Space style={{marginBottom: 16, marginRight: 16}}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: 400}}
                    maxTagCount={2}
                    placeholder="ستون هایی که میخواهید نمایش داده نشود انتخاب کنید."
                    onChange={onChange}
                    options={options}
                />
            </Space>

            <Table
                bordered
                columns={columns.filter(col => !filteredColumns.includes(col.key as string))}
                dataSource={data}
                tableLayout={"fixed"}
                scroll={{x: 3200, y: '60vh'}}
                rowKey="id"
                onChange={handleChange}
                loading={loading}
                pagination={{position: ["bottomCenter"], total:data?.count,showSizeChanger:true}}
                // rowClassName={(record, index) =>  date.format('YYYY-MM-DD').replaceAll('/' , '-') > record.expireDate  ? 'table-expired-rows' :  ''}
            />
            <TablePrint componentPDF={componentPDF} contract={data}/>
        </>
    )
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context?.req,
    context?.res,
    authOptions
  );

    const res = await fetch(`${Url}/api/documents/?fields=id,contractNumber,name,type_form,dateContract,contractPrice,durationContract,prePaidPrice,goodPrice,typeBail1,firstBail,secondBail,commitmentPrice,typeBail2,firstBail2,secondBail2,topicContract,typeContract,clearedDate,receivedDocument,clearedStatus,office`,  {
            headers: {
                'Authorization': 'Bearer ' + session?.access,
            }
        })
    const data = await res.json()
  // Pass data to the page via props
  return { props: { data }
  }
}
