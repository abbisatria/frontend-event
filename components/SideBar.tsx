import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react'
import Overview from '../public/ic-menu-overview.svg';
import Logout from '../public/ic-menu-logout.svg';
import Biotmetric from '../public/ic-biometric.webp';
import Logo from '../public/logo-black.png';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
    fetchData: Function
}

export default function SideBar(props: Props) {
    const { pathname } = useRouter();
    const { data } = useSession();
    const handleLogout = async () => {
        await signOut();
    };

    return (
        <>
            <div className="text-center mb-5">
                <Image src={Logo} alt='logo' width={150} height={50} />
            </div>
            <div className="px-3">
                <div className={pathname === '/dashboard/app' ? 'menus active-menu' : 'menus'}>
                    <div className="me-3">
                        <Image src={Overview} alt='home' />
                    </div>
                    <p className="item-title m-0">
                        <Link href="/dashboard/app">
                            Home
                        </Link>
                    </p>
                </div>
                <div className={pathname.includes('/dashboard/event') ? 'menus active-menu' : 'menus'}>
                    <div className="me-3">
                        <Image src={Overview} alt='event' />
                    </div>
                    <p className="item-title m-0">
                        <Link href="/dashboard/event">
                            Event
                        </Link>
                    </p>
                </div>
                <div className="menus">
                    <div className="me-3">
                        <Image src={Logout} alt='logout' />
                    </div>
                    <p className="item-title-logout m-0" onClick={handleLogout}>
                        <a>
                            Logout
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
