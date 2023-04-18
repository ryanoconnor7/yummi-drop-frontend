import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Meal, reserveMeal } from '../types/Meal'
import { User as FBUser } from 'firebase/auth'
import { User } from '../types/Types'
import styled from 'styled-components'
import { Back } from './Profile'
import IonIcon from '@reacticons/ionicons'
import Modal from '../components/Modal'
import moment from 'moment'
import { ListSectionHeader } from '../components/ListComponents'
import ReactMapGL, { Marker } from 'react-map-gl'
import { MAPBOX_API_KEY } from './Home'
import { useState } from 'react'
import PortionSize from '../components/PortionSize'
import { lightColors } from '../utils/Colors'
import { login } from './Login'

const MealDetail = (props: { user?: User; fbUser?: FBUser | null }) => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const meal: Meal | undefined = state.meal
    const [portions, setPortions] = useState<number>(state.portions)
    const [isReserving, setIsReserving] = useState(false)
    const [reservedMeal, setReservedMeal] = useState<Meal | undefined>(undefined)

    const reservePressed = async () => {
        setIsReserving(true)
        if (!props.fbUser) {
            try {
                await login()
            } catch (e) {}
            setIsReserving(false)
            return
        } else {
            try {
                const reservedMeal = await reserveMeal(props.fbUser!, meal!, portions)
                setReservedMeal(reservedMeal)
                setIsReserving(false)
            } catch {
                setIsReserving(false)
            }
        }
    }

    const reservedPortions = reservedMeal?.reservations?.[props.fbUser?.uid ?? ''] ?? 0

    return meal ? (
        <Modal onCancel={() => {}} backButton="prominent">
            <CoverImage src={meal?.imageUrl} />
            <Container>
                <div style={{ flexGrow: 1, position: 'relative' }}>
                    <Scroll>
                        <Content>
                            <ContentPadding>
                                <Title>{meal.mealName}</Title>
                                <BodyText style={{ marginTop: 2 }}>
                                    Ready {moment.unix(meal.pickupTime._seconds ?? 0).calendar()}
                                </BodyText>
                                <Price>
                                    ${meal.cost.toFixed(2)}
                                    <span
                                        style={{
                                            fontWeight: '400',
                                            color: lightColors.secondaryLabel
                                        }}
                                    >
                                        /portion
                                    </span>
                                </Price>
                                <ListSectionHeader>Summary</ListSectionHeader>
                                <BodyText>
                                    {meal.summary}
                                    <br />
                                    <br />
                                    Ingredients: {meal.ingredients}
                                </BodyText>
                                <ListSectionHeader>Nutrition</ListSectionHeader>
                                <BodyText>
                                    <b style={{ fontWeight: '600' }}>Total Calories: </b>
                                    {meal.calories} cal
                                </BodyText>
                                <ListSectionHeader>Chef Details</ListSectionHeader>
                                <div
                                    style={{ display: 'flex', flexDirection: 'row', marginTop: 4 }}
                                >
                                    <div
                                        style={{
                                            width: '60%',
                                            flexDirection: 'row',
                                            display: 'flex'
                                        }}
                                    >
                                        <ChefImage src={meal.chef?.profilePicUrl} />
                                        <div>
                                            <ChefName>{meal.chef?.firstName}</ChefName>
                                            <BodyText>“{meal.chef?.chefDetails}”</BodyText>
                                        </div>
                                    </div>
                                    <ReactMapGL
                                        style={{
                                            aspectRatio: 1,
                                            width: '40%',
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            zIndex: 0
                                        }}
                                        mapboxAccessToken={MAPBOX_API_KEY}
                                        mapStyle={'mapbox://styles/mapbox/streets-v9'}
                                        initialViewState={{
                                            latitude: meal.pickupLocation._latitude,
                                            longitude: meal.pickupLocation._longitude,
                                            zoom: 14
                                        }}
                                    >
                                        <Marker
                                            color="red"
                                            latitude={meal.pickupLocation._latitude}
                                            longitude={meal.pickupLocation._longitude}
                                        />
                                    </ReactMapGL>
                                </div>
                            </ContentPadding>
                        </Content>
                    </Scroll>
                </div>
                <Footer>
                    <ContentPadding>
                        {reservedMeal ? (
                            <>
                                <IonIcon
                                    style={{
                                        color: lightColors.systemGreen,
                                        width: 48,
                                        height: 48,
                                        marginTop: 4,
                                        marginBottom: 8
                                    }}
                                    name="checkmark-circle-outline"
                                />
                                <ReservedTitle>
                                    {`${reservedPortions} ${
                                        'portion' + (reservedPortions === 1 ? '' : 's')
                                    } reserved!`}
                                </ReservedTitle>
                            </>
                        ) : (
                            <>
                                <Row style={{ marginTop: -6, marginBottom: 4 }}>
                                    <Portions>Portions</Portions>
                                    <PortionSize
                                        minValue={1}
                                        maxValue={meal.portions}
                                        setValue={val => setPortions(val)}
                                        value={portions}
                                        size={18}
                                    />
                                </Row>
                                <Row>
                                    <Total style={{ flexGrow: 1 }}>Total Due at Pickup</Total>
                                    <Total>${(meal.cost * portions).toFixed(2)}</Total>
                                </Row>
                                <ReserveButton
                                    onClick={isReserving ? undefined : reservePressed}
                                    className={isReserving ? undefined : 'btn'}
                                    style={{ opacity: isReserving ? 0.5 : 1.0 }}
                                >
                                    {!props.fbUser
                                        ? 'Login to Reserve'
                                        : isReserving
                                        ? 'Reserving...'
                                        : 'Reserve'}
                                </ReserveButton>
                            </>
                        )}
                    </ContentPadding>
                </Footer>
            </Container>
        </Modal>
    ) : null
}

export default MealDetail

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 99;
    overflow: scroll;
`
const CoverImage = styled.img`
    width: 100%;
    object-fit: cover;
    height: 275px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 95;
`
const Scroll = styled.div`
    z-index: 100;
    overflow: scroll;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding-top: 251px;
    position: absolute;
    display: flex;
`
const Content = styled.div`
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    position: absolute;
    width: 100%;
    text-align: left;
    background-color: white;
    box-shadow: 0px -5px 14px #00000022;
`
const ContentPadding = styled.div`
    margin: 16px 24px;
`
const Title = styled.p`
    font-weight: 700;
    font-size: 20px;
`
const BodyText = styled.p`
    font-size: 15px;
    margin-top: 4px;
`
const Price = styled.p`
    font-weight: 500;
    font-size: 15px;
    margin-top: 4px;
`
const ChefImage = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 100px;
    object-fit: cover;
    margin-right: 8px;
`
const ChefName = styled.p`
    font-weight: 600;
    font-size: 15px;
`
const Footer = styled.div`
    width: 100%;
    background-color: white;
    box-shadow: 0px -5px 14px #00000025;
    overflow: visible;
    z-index: 110;
`
const Portions = styled.p`
    font-weight: 600;
    font-size: 16px;
    flex-grow: 1;
    text-align: left;
`
const Total = styled.p`
    font-weight: 700;
    font-size: 17px;
    text-align: left;
    margin-top: 4px;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
export const ReserveButton = styled.p`
    font-weight: 500;
    font-size: 17px;
    text-justify: center;
    align-content: center;
    background-color: black;
    color: white;
    padding: 8px;
    border-radius: 10px;
    margin-top: 16px;
`
const ReservedTitle = styled.p`
    font-weight: 600;
    font-size: 20px;
    color: ${lightColors.systemGreen};
`
