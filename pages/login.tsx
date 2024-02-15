import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Col, Container, Form, FormGroup, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify';

interface signInType {
  error: string;
  ok: boolean;
  status: number;
  url: string;
}

export default function Login() {
  const router = useRouter();

  const [data, setData] = useState({
    username: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    }) as signInType;
    if (res.ok) {
      setLoading(false)
      router.push(router.query?.callbackUrl as string || '/dashboard/app');
    } else {
      setLoading(false)
      toast('Username atau Password yang anda masukan salah', {
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
    <Container fluid>
      <Row>
        <Col md={6} className="p-5">
          <div className='d-flex h-100 flex-column justify-content-center'>
            <h3>Sign In</h3>
            <p>Masuk untuk kelola event di <b>Quarter</b></p>
            <Form onSubmit={onSubmit}>
              <FormGroup className="my-3">
                <Form.Label className="mb-2">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan username"
                  className="rounded-pill"
                  value={data.username}
                  onChange={(e) => setData({ ...data, username: e.target.value })}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Form.Label className="mb-2">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Masukkan password"
                  className="rounded-pill"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </FormGroup>
              {loading
                ? (
                  <div className="d-flex justify-content-center">
                    <Spinner color="dark" />
                  </div>
                )
                : (
                  <Button color="primary" className="w-100 rounded-pill" type='submit'>Continue to Sign In</Button>
                )}
            </Form>
          </div>
        </Col>
        <Col md={6} className="bg-login d-none d-md-block">
          <div className='d-flex h-100 flex-column justify-content-center'>
            <h6 className="title text-center">QUARTER.</h6>
            <p className="text-center">Yuk mulai kelola event</p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard/app",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
