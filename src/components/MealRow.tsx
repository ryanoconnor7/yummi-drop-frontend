import moment from 'moment'
import styled from 'styled-components'
import { Meal, Position } from '../types/Meal'
import { User } from '../types/Types'
import { distanceMiles } from '../utils/LocationUtils'

function MealRow(props: { meal: Meal; userLoc: Position; onPress: () => void }) {
    const distance = distanceMiles(props.userLoc, props.meal.pickupLocation)
    let pickupDate = moment.unix(props.meal.pickupTime._seconds)
    let pickupTimeString = 'Pickup '
    if (pickupDate.isBefore(moment())) {
        // pickupTimeString += pickupDate.format('M/D')
        pickupTimeString = 'Ready now'
    } else if (pickupDate.isSame(moment(), 'days')) {
        pickupTimeString +=
            pickupDate.minutes() > 0 ? pickupDate.format('h:mma') : pickupDate.format('ha')
    } else if (pickupDate.diff(moment(), 'days') === 1) {
        pickupTimeString += 'tomorrow'
    } else {
        pickupTimeString += pickupDate.format('dddd')
    }

    return (
        <Container onClick={props.onPress}>
            <MealImage src={props.meal.imageUrl} />
            <Details>
                <Title>{props.meal.mealName}</Title>
                <Row>
                    <LocationPin />
                    <Subtitle>
                        {distance.toFixed(1)} mi・{pickupTimeString}
                    </Subtitle>
                </Row>
                <Row>
                    <EnergyIcon />
                    <Subtitle>{props.meal.calories} calories</Subtitle>
                </Row>
                <Price>${props.meal.cost.toFixed(2)}</Price>
                <Row>
                    <ChefName>{props.meal.chef?.firstName}</ChefName>
                    <ChefImage src={props.meal.chef?.profilePicUrl} />
                </Row>
            </Details>
        </Container>
    )
}

export default MealRow

const Container = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0px 24px;
    padding: 12px 0px;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);
    cursor: pointer;
`
const MealImage = styled.img`
    width: 112px;
    height: 112px;
    border-radius: 12px;
    object-fit: cover;
`
const Details = styled.div`
    flex: 1;
    margin-left: 8px;
`
const Title = styled.p`
    font-weight: 700;
    font-size: 17px;
`
const Subtitle = styled.p`
    font-size: 15px;
    opacity: 50%;
    margin-top: 2px;
`
const Price = styled.p`
    font-size: 15px;
    font-weight: 500;
    margin-top: 2px;
    /* margin-bottom: 12px; */
`
const Row = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
`
const ChefImage = styled.img`
    width: 27px;
    height: 27px;
    border-radius: 100px;
    object-fit: cover;
`
const ChefName = styled.p`
    font-weight: 500;
    font-size: 15px;
    text-align: right;
    margin-left: auto;
    margin-right: 4px;
`
const LocationPin = () => (
    <svg
        width="8"
        height="14"
        viewBox="0 0 7 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginTop: 2, marginRight: 4 }}
    >
        <path
            d="M2.72222 8.04746V12.026L3.25743 12.8644C3.37288 13.0452 3.62736 13.0452 3.74281 12.8644L4.27778 12.026V8.04746C4.02524 8.09621 3.7659 8.12516 3.5 8.12516C3.2341 8.12516 2.97476 8.09621 2.72222 8.04746ZM3.5 0C1.56698 0 0 1.63697 0 3.65632C0 5.67568 1.56698 7.31264 3.5 7.31264C5.43302 7.31264 7 5.67568 7 3.65632C7 1.63697 5.43302 0 3.5 0ZM3.5 1.92973C2.58854 1.92973 1.84722 2.70415 1.84722 3.65632C1.84722 3.82441 1.71646 3.96101 1.55556 3.96101C1.39465 3.96101 1.26389 3.82441 1.26389 3.65632C1.26389 2.36823 2.26722 1.32034 3.5 1.32034C3.6609 1.32034 3.79167 1.45694 3.79167 1.62503C3.79167 1.79312 3.6609 1.92973 3.5 1.92973Z"
            fill="black"
            fill-opacity="0.4"
        />
    </svg>
)
const EnergyIcon = () => (
    <svg
        style={{ marginRight: 4 }}
        width="8"
        height="12"
        viewBox="0 0 8 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.40018 3.75H4.51521L5.5802 0.707813C5.6802 0.351563 5.3927 0 5.00021 0H1.40025C1.10025 0 0.845255 0.208594 0.805255 0.4875L0.00526438 6.1125C-0.0422351 6.45 0.237762 6.75 0.600258 6.75H3.56772L2.41524 11.3086C2.32524 11.6648 2.61523 12 2.99773 12C3.20773 12 3.40773 11.8969 3.51772 11.7188L7.91767 4.59375C8.15017 4.22109 7.86267 3.75 7.40018 3.75Z"
            fill="black"
            fill-opacity="0.4"
        />
    </svg>
)
