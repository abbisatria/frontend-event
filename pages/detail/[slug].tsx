import Image from 'next/image';
import { Button, Col, Container, Form, Nav, Navbar, Row, Spinner } from 'react-bootstrap'
import Logo from '../../public/logo.png'
import { useCallback, useEffect, useState } from 'react';
import { getDetailActiveEvent } from '@/services/event';
import { useRouter } from 'next/router';
import { HomeList, responseDetailActiveEventType, responseType } from '@/types/global.type';
import { toast } from 'react-toastify';
import { setTransaction } from '@/services/transaction';
import { formatNumber } from '@/helpers/formatNumber';

export default function DetailEvent() {

    const [data, setData] = useState({
        name: '',
        email: '',
        gender: '',
        no_whatsapp: '',
        quantity: '',
    })

    const [detailEvent, setDetailEvent] = useState<HomeList>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter()

    const fetchDetail = useCallback(async () => {
        if (router.isReady) {
            const id = router.query.slug as string
            const response = await getDetailActiveEvent(Number(id)) as responseDetailActiveEventType;
            if (response?.results?.id) {
                setDetailEvent(response.results)
            } else {
                toast('Event Tidak ditemukan', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                router.push('/')
            }
        }
    }, [router.isReady])

    useEffect(() => {
        if (router.query.slug) {
            fetchDetail()
        }
    }, [fetchDetail, router.query.slug])

    const submit = async () => {
        if (data.email && data.gender && data.name && data.no_whatsapp && data.quantity) {
            setIsLoading(true)
            try {
                const response = await setTransaction({
                    email: data.email,
                    name: data.name,
                    gender: data.gender,
                    no_whatsapp: data.no_whatsapp,
                    id_detail_event: Number(router.query.slug),
                    type_ticket: detailEvent?.type_ticket || '',
                    quantity: Number(data.quantity),
                    price: detailEvent?.price ? Number(detailEvent.price) : 0
                }) as responseType
                setIsLoading(false)
                if (response.success) {
                    toast('Transaksi Berhasil, Silahkan cek email', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    setData({
                        name: '',
                        email: '',
                        gender: '',
                        no_whatsapp: '',
                        quantity: '',
                    })
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

    return (
        <>
            <Container fluid style={{
                backgroundImage: 'linear-gradient(0deg,rgba(43, 21, 107, 0.8),rgba(43, 21, 107, 0.8)),url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                backgroundSize: 'cover'
            }}>
                <Container>
                    <Navbar expand="md">
                        <Navbar.Brand href="/">
                            <Image src={Logo} alt='logo-quarter' width={120} />
                        </Navbar.Brand>
                        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse
                            id="basic-navbar-nav"
                            className="justify-content-between"
                        >
                            <Nav className='ms-auto'>
                                <Nav.Link href="/" className='text-white'>Home</Nav.Link>
                                <Nav.Link href="/#ticket" className='text-white'>Ticket</Nav.Link>
                                <Nav.Link href="/" className='text-white'>Maps</Nav.Link>
                                <Nav.Link href="/" className='text-white'>About</Nav.Link>
                            </Nav>
                        </Navbar.Collapse> */}
                    </Navbar>
                </Container>
                <Container fluid className='header-title' style={{
                    minHeight: '20vh',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h1 className='text-white text-center'>{detailEvent?.title || ''}</h1>
                    <h4 className='text-white text-center'>Rp. {detailEvent?.price ? formatNumber(Number(detailEvent?.price)) : 0}</h4>
                </Container>
            </Container>
            <Container className='my-3'>
                <h3>Form Pembelian Ticket</h3>
                <div className='card-ticket'>
                    <Row>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Email Aktif</Form.Label>
                            <Form.Control placeholder='Masukkan Email Aktif' type='email' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control placeholder='Masukkan Nama Lengkap' type='text' value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Jenis Kelamain</Form.Label>
                            <Form.Select value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value })}>
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </Form.Select>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Jumlah Ticket</Form.Label>
                            <Form.Control placeholder='Masukkan Jumlah Ticket' type='number' value={data.quantity} onChange={(e) => setData({ ...data, quantity: e.target.value })} />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Jenis Ticket</Form.Label>
                            <Form.Control value={detailEvent?.type_ticket} type='text' disabled />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>No Whatsapp</Form.Label>
                            <Form.Control placeholder='Masukkan No Whatsapp' type='number' value={data.no_whatsapp} onChange={(e) => setData({ ...data, no_whatsapp: e.target.value })} />
                        </Col>
                    </Row>
                </div>
                {isLoading ? <Spinner /> : <Button className='w-100 mt-4' style={{ backgroundColor: 'rgba(43, 21, 107, 1)' }} onClick={submit}>Beli Ticket</Button>}
            </Container>
            <div className="footer">
                <Container className='p-3 text-center'>
                    <Image src={Logo} alt='logo-quarter' width={120} />
                    <p className='mt-3'>
                        Stop waiting in line. Buy tickets <br />
                        conveniently
                    </p>
                </Container>
                <Container fluid>
                    <Row>
                        <Col className="copyright pt-4 text-center">
                            &copy; 2024 Quarter • All Rights Reserved.
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}
