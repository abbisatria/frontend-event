import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap'
import SideBar from '@/components/SideBar'
import BottomBar from '@/components/BottomBar'
import { formatNumber } from '@/helpers/formatNumber'
import useDebounce from '@/helpers/useDebounce'
import usePrevious from '@/helpers/usePrevious'
import Pagination from 'react-js-pagination'
import { editTransaction, getTransaction, getTransactionDashboard } from '@/services/transaction'
import { ListTransactionType, StatusType, responseDashboardType, responseListTransactionType, responseType } from '@/types/global.type'
import { toast } from 'react-toastify'

export default function App(this: any) {

    const [data, setData] = useState<ListTransactionType[]>([])
    const [search, setSearch] = useState<string>('')
    const [kategori, setKategori] = useState<string>('')
    const [isModal, setIsModal] = useState<boolean>(false)
    const [isModalApprove, setIsModalApprove] = useState<boolean>(false)
    const [preview, setPreview] = useState<string>('')
    const [status, setStatus] = useState<StatusType[]>([])
    const [detail, setDetail] = useState<ListTransactionType>()

    const toggle = () => setIsModal(!isModal)
    const toggleApprove = () => setIsModalApprove(!isModalApprove)
    const [pageInfo, setPageInfo] = useState({
        totalData: 0,
        totalPage: 0
    })
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 500)

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
                search,
                status: kategori
            }
            const response = await getTransaction(params) as responseListTransactionType
            setData(response.results.data)
            const pageInfo = {
                totalData: response.results.count,
                totalPage: response.results.pageCount
            }
            setPageInfo(pageInfo)
            if (prevSearch !== debounceSearch) {
                setPage(newPage as number)
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }

    const getDataDashboard = async () => {
        try {
            const response = await getTransactionDashboard() as responseDashboardType
            if (response.results.length > 0) {
                setStatus(response.results)
            }
        } catch (err) { }
    }

    const handleChangePage = (page: number) => {
        setPage(page)
        getData(page)
    }

    useEffect(() => {
        getData()
    }, [debounceSearch, kategori])

    useEffect(() => {
        getDataDashboard()
    }, [])

    const getStatus = (value: 'PENDING' | 'WAITING' | 'SUCCESS') => {
        const dataStatus = status.find(res => res.status === value)
        if (dataStatus) {
            return formatNumber(Number(dataStatus.count))
        }
        return 0
    }
    const submit = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('status', 'SUCCESS')
            formData.append('name_event', detail?.DetailEvent?.Event?.title || '')
            formData.append('email', detail?.Customer?.email || '')
            const response = await editTransaction(formData, detail?.id ? detail.id : 0) as responseType
            setIsLoading(false)
            if (response.success) {
                toast('Transaksi berhasil di approve', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                toggleApprove()
                getData()
                getDataDashboard()
            } else {
                toast(response?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (err) {
            setIsLoading(false)
            toast('Ada Kesalahan Pada Saat Request', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    return (
        <Container fluid className="p-4">
            <Modal show={isModal} onHide={toggle} className='text-center' size='lg'>
                <Modal.Header closeButton />
                <Modal.Body>
                    <img src={preview} alt={preview} className='img-fluid' />
                </Modal.Body>
            </Modal>
            <Modal show={isModalApprove} onHide={toggleApprove} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Approve Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Apakah Anda Yakin ingin approve?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleApprove}>Tidak</Button>
                    {isLoading ? <Spinner /> : <Button variant="primary" onClick={submit}>Ya</Button>}
                </Modal.Footer>
            </Modal>
            <Row className='mb-5'>
                <Col md={2} className="d-none d-md-block">
                    <SideBar fetchData={() => null} />
                </Col>
                <Col md={10} lg={10} sm={12} xs={12} className='mb-5'>
                    <div className='mb-3'>
                        <h3>Dashboard</h3>
                    </div>
                    <div>
                        <Row>
                            <Col md={4}>
                                <Card className='border-0 shadow mb-4'>
                                    <Card.Body>
                                        <h5 className='mb-2'>Transaksi Pending</h5>
                                        <h6 className='mb-0'>{getStatus('PENDING')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className='border-0 shadow mb-4'>
                                    <Card.Body>
                                        <h5 className='mb-2'>Transaksi Menunggu Konfirmasi</h5>
                                        <h6 className='mb-0'>{getStatus('WAITING')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className='border-0 shadow mb-4'>
                                    <Card.Body>
                                        <h5 className='mb-2'>Transaksi Berhasil</h5>
                                        <h6 className='mb-0'>{getStatus('SUCCESS')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Card className='border-0 shadow'>
                            <Card.Body>
                                <Row className='mb-3'>
                                    <Col md={6}>
                                        <Form.Label>Filter By Status</Form.Label>
                                        <Form.Select value={kategori} onChange={(e) => setKategori(e.target.value)}>
                                            <option value="">Pilih Status</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="WAITING">Menunggu Konfirmasi</option>
                                            <option value="SUCCESS">Berhasil</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Filter By Customer</Form.Label>
                                        <Form.Control placeholder='Search Customer' value={search} onChange={(e) => setSearch(e.target.value)} />
                                    </Col>
                                </Row>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama Customer</th>
                                            <th>Email / No Whatsapp</th>
                                            <th>Event</th>
                                            <th>Jumlah Ticket</th>
                                            <th>Total Pembayaran</th>
                                            <th>Status</th>
                                            <th>Bukti Pembayaran</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && (
                                            <tr>
                                                <td colSpan={8} className='text-center'>
                                                    <Spinner />
                                                </td>
                                            </tr>
                                        )}
                                        {data.length > 0 ? data.map((val, idx: number) => {
                                            return (
                                                <tr key={String(idx)}>
                                                    <td>{((page - 1) * 10) + (idx + 1)}</td>
                                                    <td>{val?.Customer?.name}</td>
                                                    <td>{val?.Customer?.email} / {val?.Customer?.no_whatsapp}</td>
                                                    <td>{val?.DetailEvent?.Event?.title} - {val?.DetailEvent?.type_ticket}</td>
                                                    <td>{formatNumber(val.quantity || 0)}</td>
                                                    <td>{formatNumber((val.quantity * val?.DetailEvent?.price) + 3000)}</td>
                                                    <td>
                                                        <Badge bg={val.status === 'PENDING' ? 'secondary' : val.status === 'WAITING' ? 'warning' : 'success'}>{val.status}</Badge>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => {
                                                            toggle()
                                                            setPreview(`https://quarter-be.syntechsia.com/images/transaction/${val.upload_proof_transaction}`)
                                                        }} hidden={!val.upload_proof_transaction}>Lihat Bukti</Button>
                                                    </td>
                                                    <td>
                                                        <Button hidden={val.status === 'SUCCESS' || val.status === 'PENDING'} onClick={() => {
                                                            setDetail(val)
                                                            toggleApprove()
                                                        }}>Approve</Button>
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
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
            <BottomBar />
        </Container>
    )
}
