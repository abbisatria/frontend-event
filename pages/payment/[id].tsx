import Image from 'next/image';
import { Button, Col, Container, Form, Nav, Navbar, Row, Spinner } from 'react-bootstrap'
import Logo from '../../public/logo.png'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { PaymentDetail, responseDetailPaymentEventType, responseType } from '@/types/global.type';
import { toast } from 'react-toastify';
import { editTransaction, getDetailPaymentTransaction } from '@/services/transaction';
import { formatNumber } from '@/helpers/formatNumber';
import Qris from '../../public/qris.jpeg';

export default function DetailPayment() {

    const [detailPayment, setDetailPayment] = useState<PaymentDetail>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [image, setImage] = useState<any>('')
    const inputRef = useRef<any>(null);

    const router = useRouter()

    const fetchDetail = useCallback(async () => {
        if (router.isReady) {
            const id = router.query.id as string
            const response = await getDetailPaymentTransaction(Number(id)) as responseDetailPaymentEventType;
            if (response?.results?.id) {
                setDetailPayment(response.results)
            } else {
                toast('Payment Tidak ditemukan', {
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
        if (router.query.id) {
            fetchDetail()
        }
    }, [fetchDetail, router.query.id])

    const submit = async () => {
        if (image) {
            setIsLoading(true)
            try {
                const formData = new FormData();
                formData.append('image', image)
                formData.append('name', detailPayment?.name || '')
                formData.append('title', detailPayment?.title || '')
                formData.append('type_ticket', detailPayment?.type_ticket || '')
                formData.append('status', 'WAITING')
                const response = await editTransaction(formData, Number(router.query.id)) as responseType
                setIsLoading(false)
                if (response.success) {
                    toast('Transaksi Berhasil, Silahkan tunggu konfirmasi admin, selalu cek email anda', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    if (inputRef.current) {
                        inputRef.current.value = null;
                    }
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
            toast('Bukti Pembayaran Wajib diupload', {
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
                    <h1 className='text-white text-center'>{detailPayment?.title || ''}</h1>
                    <h4 className='text-white text-center'>Total Rp. {detailPayment?.total ? formatNumber(Number(detailPayment?.total) + 3000) : 0}</h4>
                </Container>
            </Container>
            <Container className='my-3'>
                <div className='text-center mb-3'>
                    <Image src={Qris} alt='qr-quarter' style={{ borderRadius: 12, width: 800, height: 400, objectFit: 'contain' }} className='img-fluid' />
                </div>
                <h3>Form Pembelian Ticket</h3>
                <div className='card-ticket'>
                    <Row>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Email Aktif</Form.Label>
                            <Form.Control placeholder='Masukkan Email Aktif' type='email' value={detailPayment?.email || ''} disabled />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control placeholder='Masukkan Nama Lengkap' type='text' value={detailPayment?.name || ''} disabled />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Jenis Kelamain</Form.Label>
                            <Form.Select value={detailPayment?.gender || ''} disabled>
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </Form.Select>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Jumlah Ticket</Form.Label>
                            <Form.Control placeholder='Masukkan Jumlah Ticket' type='number' value={detailPayment?.quantity || ''} disabled />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>Jenis Ticket</Form.Label>
                            <Form.Control value={detailPayment?.type_ticket || ''} disabled />
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Label>No Whatsapp</Form.Label>
                            <Form.Control placeholder='Masukkan No Whatsapp' type='number' value={detailPayment?.no_whatsapp || ''} disabled />
                        </Col>
                        <Col md={12} className='mb-3'>
                            <Form.Label>Upload Bukti Pembayaran</Form.Label>
                            <Form.Control placeholder='Masukkan No Whatsapp' type='file' ref={inputRef} accept='image/*' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files) {
                                    setImage(e.target.files[0])
                                }
                            }} />
                        </Col>
                    </Row>
                </div>
                {isLoading ? <Spinner /> : <Button className='w-100 mt-4' style={{ backgroundColor: 'rgba(43, 21, 107, 1)' }} onClick={submit}>Konfirmasi Pembayaran</Button>}
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
