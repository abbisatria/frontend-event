import BottomBar from '@/components/BottomBar'
import SideBar from '@/components/SideBar'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { EventList, responseDetailEventType, responseType } from '@/types/global.type'
import { editEvent, getDetailEvent } from '@/services/event'
import moment from 'moment'

const Edit = () => {
    const [data, setData] = useState<EventList>({
        title: '',
        image: '',
        DetailEvents: []
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isModal, setIsModal] = useState<boolean>(false)
    const [preview, setPreview] = useState<string>('')
    const router = useRouter()

    const toggle = () => setIsModal(!isModal)

    const submit = async () => {
        if (data.title && data.DetailEvents.length > 0 && data.image) {
            setIsLoading(true)
            try {
                const formData = new FormData();
                formData.append('title', data.title)
                formData.append('image', data.image)
                formData.append('events', JSON.stringify(data.DetailEvents))
                const response = await editEvent(formData, Number(router.query.id)) as responseType
                setIsLoading(false)
                if (response.success) {
                    toast('Update event berhasil', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    router.push('/dashboard/event')
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
        } else {
            setIsLoading(false)
            toast('Form Wajib diisi Semua', {
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

    const fetchDetail = useCallback(async () => {
        if (router.isReady) {
            const id = router.query.id as string
            const response = await getDetailEvent(Number(id)) as responseDetailEventType;
            if (response?.results?.id) {
                setData({...response?.results})
                setPreview(`https://quarter-be.syntechsia.com/images/photo/${response.results.image}`)
            } else {
                toast('Data Event Tidak ditemukan', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                router.push('/dashboard/event')
            }
        }
    }, [router.isReady])

    useEffect(() => {
        if (router.query.id) {
            fetchDetail()
        }
    }, [fetchDetail, router.query.id])

    return (
        <Container fluid className="p-4" style={{ height: '100vh' }}>
            <Modal show={isModal} onHide={toggle} className='text-center' size='lg'>
                <Modal.Header closeButton />
                <Modal.Body>
                    <img src={preview} alt={preview} className='img-fluid' />
                </Modal.Body>
            </Modal>
            <Row>
                <Col md={2} className="d-none d-md-block">
                    <SideBar fetchData={() => null} />
                </Col>
                <Col md={10} lg={10} sm={12} xs={12} style={{ marginBottom: '7rem' }}>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h3>Update Event</h3>
                    </div>
                    <div className='mb-3'>
                        <Form.Label>Nama Event</Form.Label>
                        <Form.Control type='text' placeholder='Masukkan Nama Event' value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
                    </div>
                    <div className='d-flex justify-content-end'>
                        <Button onClick={() => {
                            setData({ ...data, DetailEvents: [
                                ...data.DetailEvents,
                                {
                                    end_date: '',
                                    price: 0,
                                    quantity_ticket: 0,
                                    start_date: '',
                                    type_ticket: ''
                                }
                            ] })
                        }}>Tambah Tipe Ticket</Button>
                    </div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Jenis Ticket</th>
                                <th>Harga Ticket</th>
                                <th>Jumlah Ticket</th>
                                <th>Mulai Dari</th>
                                <th>Sampai</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.DetailEvents.map((val, idx) => {
                                return (
                                    <tr key={String(idx)}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <Form.Control type='text' placeholder='Masukkan Jenis Ticket' value={val.type_ticket} onChange={(e) => {
                                                const dataRes = [...data.DetailEvents]
                                                dataRes[idx].type_ticket = e.target.value
                                                setData({ ...data, DetailEvents: dataRes })
                                            }} />
                                        </td>
                                        <td>
                                            <Form.Control type='number' placeholder='Masukkan Harga Ticket' value={val.price} onChange={(e) => {
                                                const dataRes = [...data.DetailEvents]
                                                dataRes[idx].price = e.target.value
                                                setData({ ...data, DetailEvents: dataRes })
                                            }} />
                                        </td>
                                        <td>
                                            <Form.Control type='number' placeholder='Masukkan Jumlah Ticket' value={val.quantity_ticket} onChange={(e) => {
                                                const dataRes = [...data.DetailEvents]
                                                dataRes[idx].quantity_ticket = e.target.value
                                                setData({ ...data, DetailEvents: dataRes })
                                            }} />
                                        </td>
                                        <td>
                                            <Form.Control type='date' placeholder='Masukkan Jumlah Ticket' value={val.start_date} onChange={(e) => {
                                                const dataRes = [...data.DetailEvents]
                                                dataRes[idx].start_date = e.target.value
                                                setData({ ...data, DetailEvents: dataRes })
                                            }} />
                                        </td>
                                        <td>
                                            <Form.Control type='date' placeholder='Masukkan Jumlah Ticket' value={val.end_date} onChange={(e) => {
                                                const dataRes = [...data.DetailEvents]
                                                dataRes[idx].end_date = e.target.value
                                                setData({ ...data, DetailEvents: dataRes })
                                            }} />
                                        </td>
                                        <td>
                                            <Button variant='danger' onClick={() => {
                                                const dataRes = [...data.DetailEvents]
                                                const filter = dataRes.filter((v, i) => i !== idx)
                                                setData({ ...data, DetailEvents: filter })
                                            }}>Hapus</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    <div className='mb-3'>
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type='file' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files) {
                                setData({ ...data, image: e.target.files[0] })
                                setPreview(URL.createObjectURL(e.target.files[0]))
                            }
                        }} accept='image/*' />
                        <Button className='mt-3' hidden={!preview} onClick={toggle}>Preview Image</Button>
                    </div>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Button className='w-100' onClick={submit}>Kirim</Button>
                    )}
                </Col>
            </Row>
            <BottomBar />
        </Container>
    )
}

export default Edit