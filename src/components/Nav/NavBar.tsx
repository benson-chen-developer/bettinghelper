import React, { Dispatch, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { green, pink } from '../../data/colors'
import { Promo } from './Promo'
import { SearchBar } from './SearchBar'

interface Props {
    
}

export const NavBar: React.FC<Props> = ({
    
}) => {
    const navigate = useNavigate();
    const promoCodes = [
        {
            name:'PrizePicks',
            url: 'https://app.prizepicks.com/sign-up?invite_code=PR-9LWKBZ1',
            promo: 'PR-9LWKBZ1', 
            picName: "prizepicks.png",
            text: '$100 Bonus!'
        },
        {
            name:'UnderDog',
            url: 'https://play.underdogfantasy.com/goodluck255',
            promo: 'GOODLUCK255',
            picName: "underdog.jpeg",
            text: '$250 Bonus!'
        },
        {
            name: "Sleeper",
            url: 'https://sleeper.com/promo/RF-BENSON456',
            promo: 'BENSON456',
            picName: "sleeper.jpeg",
            text: '$100 Bonus!'
        }
    ]
    return (
        <nav style={{
            width: '100%', 
            height: '70px', 
            background: "#F33479", 
            display: 'flex',
            alignItems: 'center',
            position: 'fixed', // Make the navbar fixed
            top: 0, // Stick it to the top
            zIndex: 1000 // Ensure it stays above other content
        }}>
            <h1 
                style={{fontWeight:'bold', marginLeft: '30px', cursor:'pointer'}}
                onClick={() => {navigate('/')}}
            >
                Sports Stats
            </h1>

            <SearchBar />

            <div style={{marginRight:'10px'}}/>
            {promoCodes.map((promo, index) =>
                <Promo
                    picName={promo.picName} name={promo.name} 
                    text={promo.text} promo={promo.promo}
                    url={promo.url} key={index}
                />
            )}
        </nav>
    )
}