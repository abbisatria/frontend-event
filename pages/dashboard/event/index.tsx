import BottomBar from '@/components/BottomBar'
import SideBar from '@/components/SideBar'
import { formatNumber } from '@/helpers/formatNumber'
import useDebounce from '@/helpers/useDebounce'
import usePrevious from '@/helpers/usePrevious'
import { getEvent } from '@/services/event'
import { EventList, responseEventListType } from '@/types/global.type'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap'
import Pagination from 'react-js-pagination'

const Event = () => {
    const [data, setData] = useState<EventList[]>([])
    const [search, setSearch] = useState('')
    const [pageInfo, setPageInfo] = useState({
        totalData: 0,
        totalPage: 0
    })
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 500)

    const router = useRouter()

    const prevSearch = usePrevious(debounceSearch)

    const getData = async (value?: any) => {
        try {
            setLoading(true)
            let newPage
            if (prevSearch !== debounceSearch) {
                newPage = 1
            }
            const params = {
                page: value || newPage,
                search
            }
            const response = await getEvent(params) as responseEventListType
            setData(response.results.data)
            const pageInfo = {
                totalData: response.results.count,
                totalPage: response.results.pageCount
            }
            setPageInfo(pageInfo)
            setLoading(false)
            if (prevSearch !== debounceSearch) {
                setPage(newPage as number)
            }
        } catch (err) {
            setLoading(false)
        }
    }

    const handleChangePage = (page: number) => {
        setPage(page)
        getData(page)
    }

    useEffect(() => {
        getData()
    }, [debounceSearch])

    return (
        <Container fluid className="p-4">
            <Row>
                <Col md={2} className="d-none d-md-block">
                    <SideBar fetchData={() => null} />
                </Col>
                <Col md={10} lg={10} sm={12} xs={12} className='mb-5'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h3>List Event</h3>
                    </div>
                    <Row className='align-items-end'>
                        <Col>
                            <Form.Label>Search</Form.Label>
                            <Form.Control type='text' placeholder='Search .....' onChange={(e) => setSearch(e.target.value)} className='mb-3' />
                        </Col>
                    </Row>
                    <div className='d-flex justify-content-end'>
                        <Button onClick={() => router.push('/dashboard/event/add')}>Tambah Event</Button>
                    </div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Event</th>
                                <th>Tipe Ticket</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} className='text-center'>
                                        <Spinner />
                                    </td>
                                </tr>
                            )}
                            {data.length > 0 ? data.map((val, idx: number) => {
                                return (
                                    <tr key={String(idx)}>
                                        <td>{((page - 1) * 10) + (idx + 1)}</td>
                                        <td>{val.title}</td>
                                        <td>
                                            {val.DetailEvents.map((res, index) => {
                                                return (
                                                    <div key={String(index)}>
                                                        <p>{res.type_ticket}</p>
                                                        <ul>
                                                            <li>Harga Ticket Rp. {formatNumber(Number(res.price) || 0)}</li>
                                                            <li>Jumlah Ticket Rp. {formatNumber(Number(res.price) || 0)}</li>
                                                            <li>{moment(res.start_date).format('DD-MMM-YYYY')} - {moment(res.end_date).format('DD-MMM-YYYY')}</li>
                                                        </ul>
                                                    </div>
                                                )
                                            })}
                                        </td>
                                        <td>
                                            <Button className='me-3 mb-3' onClick={() => router.push(`/dashboard/event/edit/${val.id}`)}>Edit</Button>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={8} className='text-center'>
                                        Data Kosong
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {pageInfo.totalData > 0 && (
                        <div className="d-flex justify-content-end mt-4">
                            <Pagination
                                activePage={page}
                                itemsCountPerPage={10}
                                totalItemsCount={pageInfo.totalData}
                                pageRangeDisplayed={3}
                                onChange={handleChangePage.bind(this)}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                </Col>
            </Row>
            <BottomBar />
        </Container>
    )
}

export default Event