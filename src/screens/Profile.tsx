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
import { useLocation, useNavigate } from 'react-router-dom'
import NewMealButton from '../components/NewMealButton'
import Modal from '../components/Modal'
import SignOutButton from '../components/SignOutButton'
import { Meal, ReservedMealsResponse, getReservedMeals } from '../types/Meal'
import MealRow from '../components/MealRow'
import moment from 'moment'
import { SpinnerWrapper } from './Home'
import { PuffLoader } from 'react-spinners'

const Profile = (props: { user?: User; fbUser?: FBUser | null }) => {
    const navigate = useNavigate()
    const auth = getAuth()
    const { state } = useLocation()
    const [mealsResponse, setMealsResponse] = useState<ReservedMealsResponse | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true)
    const [centerCoords, setCenterCoords] = useState<number[]>(state?.centerCoords)

    const fetchMeals = async () => {
        try {
            const response = await getReservedMeals(props.fbUser ?? undefined)
            console.log('Profile meals:', response)
            setMealsResponse(response)
        } catch (e) {
            console.log('Error fetching meals for profile:', e)
        }
    }

    useEffect(() => {
        fetchMeals()
    }, [])

    const allMeals: Meal[] = [
        ...(mealsResponse?.reserved ?? []),
        ...(mealsResponse?.cooking.map(m => {
            m.cooking = true
            return m
        }) ?? [])
    ]

    const upcomingMeals = {
        title: 'Upcoming Meals',
        data: allMeals
            .filter(m => moment.unix(m.pickupTime._seconds).isAfter(moment()))
            .sort((a, b) => a.pickupTime._seconds - b.pickupTime._seconds)
    }
    const pastMeals = {
        title: 'Past Meals',
        data: allMeals
            .filter(m => moment.unix(m.pickupTime._seconds).isBefore(moment()))
            .sort((a, b) => b.pickupTime._seconds - a.pickupTime._seconds)
    }

    return (
        <Modal onCancel={() => {}}>
            <Container>
                <Scroll>
                    <Content>
                        <ProfileButton src={props.user?.profilePicUrl ?? blankProfileImage} />
                        <Name>
                            {props.user?.firstName} {props.user?.lastName}
                        </Name>
                        <NewMealButton onPress={() => navigate('/meal/new')} />
                        <SignOutButton onPress={() => signOut(auth)} />
                        <MealsWrapper>
                            {isLoading && !mealsResponse ? (
                                <SpinnerWrapper>
                                    <PuffLoader color={lightColors.fillaBlue} />
                                </SpinnerWrapper>
                            ) : (
                                [upcomingMeals, pastMeals].map(section => (
                                    <>
                                        <ListSectionHeader>{section.title}</ListSectionHeader>
                                        {section.data.length ? (
                                            section.data.map(meal => (
                                                <MealRow
                                                    fbUser={props.fbUser ?? undefined}
                                                    showPastDates={true}
                                                    padding={false}
                                                    key={meal.id}
                                                    meal={meal}
                                                    userLoc={{
                                                        _latitude: centerCoords[0],
                                                        _longitude: centerCoords[1]
                                                    }}
                                                    onPress={() =>
                                                        navigate('meal/1234', {
                                                            state: { meal, portions: 1 }
                                                        })
                                                    }
                                                />
                                            ))
                                        ) : (
                                            <NoMeals>No {section.title}</NoMeals>
                                        )}
                                    </>
                                ))
                            )}
                        </MealsWrapper>
                    </Content>
                </Scroll>
            </Container>
        </Modal>
    )
}

export default Profile

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Scroll = styled.div`
    z-index: 100;
    overflow: scroll;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    position: absolute;
    display: flex;
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
const NoMeals = styled.p`
    font-size: 15px;
    font-weight: 500;
    font-style: italic;
    text-align: start;
    color: ${lightColors.secondaryLabel};
    margin-top: 8px;
`
const MealsWrapper = styled.div`
    align-items: start;
    width: 100%;
`
