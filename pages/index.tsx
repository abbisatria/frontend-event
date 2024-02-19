import Image from 'next/image';
import { Button, Card, Col, Container, Navbar, Row, Spinner } from 'react-bootstrap'
import Logo from '../public/logo.png'
import { useRouter } from 'next/router';
import { getEvent } from '@/services/event';
import { EventList, HomeList, HomeType, responseEventListAllType } from '@/types/global.type';
import moment from 'moment';
import { formatNumber } from '@/helpers/formatNumber';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<HomeList[]>([])

  const getData = async () => {
    try {
      setLoading(true)
      const response = await getEvent({ all: true }) as responseEventListAllType
      setData(response.results)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Container fluid className='bg-header'>
        <Container>
          <Navbar expand="md">
            <Navbar.Brand href="#home">
              <Image src={Logo} alt='logo-quarter' width={120} />
            </Navbar.Brand>
          </Navbar>
        </Container>
        <Container className='header-title'>
          <h1 className='text-white text-center'>Book Your Events</h1>
          <h6 className='text-white text-center'>Quarter event provides interesting events for all of you</h6>
        </Container>
      </Container>
      <Container className='mb-3'>
        <h1>Get Ticket Here</h1>
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {loading ? <Spinner /> : data.map((val, idx) => {
            const startDate = moment(val.start_date || new Date()).valueOf();
            const endDate = moment(`${val.end_date.split('T')[0]}T23:59:00.000Z` || new Date()).valueOf();
            const date = moment().valueOf();
            const isActive = date >= startDate && date <= endDate
            return (
              <Card style={{ minWidth: '17rem', maxWidth: '17rem', marginRight: '20px' }} key={String(idx)}>
                <Card.Img variant="top" src={`https://quarter-be.syntechsia.com/images/photo/${val.image}`} height={200} style={{ objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{val.title}</Card.Title>
                  <Card.Text className='mb-1'>
                    {val.type_ticket}
                  </Card.Text>
                  <Card.Text style={{ fontWeight: 'bold' }} className='mb-1'>
                    Rp {formatNumber(Number(val.price) || 0)}
                  </Card.Text>
                  <Button variant="secondary" className='w-100' style={isActive ? { backgroundColor: 'rgba(43, 21, 107, 1)' } : {}} onClick={() => isActive && router.push(`/detail/${val.id}`)}>
                    {isActive ? 'Buy Ticket' : 'Coming Soon'}
                  </Button>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      </Container>
      <Container style={{ backgroundColor: 'rgba(43, 21, 107, 1)' }}>

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
