import { useEffect, useState } from 'react'
import { User } from '../types/Types'
import { User as FBUser, getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { login } from './Login'
import styled from 'styled-components'
import blankProfileImage from '../assets/person-circle-outline.png'
import IonIcon from '@reacticons/ionicons'
import { lightColors } from '../utils/Colors'
import { borderRadius } from '@mui/system'
import { ListSectionHeader } from '../components/ListComponents'
import { useNavigate } from 'react-router-dom'
import NewMealButton from '../components/NewMealButton'
import Modal from '../components/Modal'

const Profile = (props: { user?: User; fbUser?: FBUser | null }) => {
    const navigate = useNavigate()
    const auth = getAuth()

    return (
        <Modal onCancel={() => {}}>
            <Container>
                <Content>
                    <ProfileButton src={props.user?.profilePicUrl ?? blankProfileImage} />
                    <Name>
                        {props.user?.firstName} {props.user?.lastName}
                    </Name>
                    <NewMealButton onPress={() => navigate('/meal/new')} />
                    <ListSectionHeader>Upcoming Meals</ListSectionHeader>
                    <button onClick={() => signOut(auth)}>Sign Out</button>
                </Content>
            </Container>
        </Modal>
    )
}

export default Profile

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
`

const Content = styled.div`
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`
const ProfileButton = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    align-self: center;
    background-color: #00000020;
    cursor: pointer;
`
const Name = styled.p`
    font-weight: 700;
    font-size: 20px;
    margin-top: 8px;
`
export const Back = styled.div`
    background-color: rgba(217, 217, 217, 0.6);
    position: absolute;
    left: 24px;
    top: 24px;
    border-radius: 50px;
    padding: 3px;
    padding-bottom: 0px;
    z-index: 1000;
`
