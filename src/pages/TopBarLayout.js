import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import React from 'react'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import styles from '../css/TopBarLayout.module.css'

const TopBarLayout = () => {

    return (
        <>
            
                <TopBar />
                <main className={styles.maincont}>
                    <SideBar />
                    <content className={styles.out}>
                        <Outlet />
                    </content>
                </main>
        </>
    )
}

export default TopBarLayout 