import React from 'react'
import Overview from '../public/ic-menu-overview.svg';
import Logout from '../public/ic-menu-logout.svg';
import { NavLink, Navbar } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

export default function BottomBar() {
    const { pathname } = useRouter();
    const handleLogout = async () => {
        await signOut();
    };

    return (
        <div className="d-lg-none d-md-none d-sm-block">
            <Navbar color="light" expand="md" fixed="bottom" className={`px-4 bg-menu`}>
                <NavLink href="/" className={(pathname === '/dashboard/app') ? 'active-menu d-flex flex-column align-items-center' : 'd-flex flex-column align-items-center'}>
                    <Image src={Overview} alt='home' />
                    <p className="item-title">Home</p>
                </NavLink>
                <NavLink href="/event" className={(pathname.includes('/dashboard/event')) ? 'active-menu d-flex flex-column align-items-center' : 'd-flex flex-column align-items-center'}>
                    <Image src={Overview} alt='event' />
                    <p className="item-title">Event</p>
                </NavLink>
                <NavLink className="d-flex flex-column align-items-center" onClick={handleLogout}>
                    <Image src={Logout} alt='logout' />
                    <p className="item-title">Logout</p>
                </NavLink>
            </Navbar>
        </div>
    )
}
