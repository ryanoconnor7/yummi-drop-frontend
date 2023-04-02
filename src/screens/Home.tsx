import ReactMapGL, { GeolocateControl, ViewState, GeolocateControlRef, Marker } from 'react-map-gl'
import mapboxgl from 'mapbox-gl' // This is a dependency of react-map-gl even if you didn't explicitly install it
import 'mapbox-gl/dist/mapbox-gl.css'
import { lightColors } from '../utils/Colors'
import { BottomSheet } from 'react-spring-bottom-sheet'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { User, categories } from '../types/Types'
import MealRow from '../components/MealRow'
import FilterButton from '../components/FilterButton'
import { CategorySheet, DatePickerSheet, isDesktop, PortionSizeSheet } from '../components/Sheet'
import moment from 'moment'
import { pickupTimeFilterDisplay, shortTime } from '../utils/TimeUtils'
import { getMeals, Meal, testMeals } from '../types/Meal'
import { useNavigate } from 'react-router-dom'
import { login } from './Login'
import { auth } from '../App'
import { getAuth } from 'firebase/auth'

// @ts-ignore
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default // eslint-disable-line import/no-webpack-loader-syntax
const MAPBOX_API_KEY =
    'pk.eyJ1Ijoicnlhbm9jb25ub3I3IiwiYSI6ImNsZm45NGl4NTAycms0M3Qya3EyOG55YzYifQ.KmSgNqJREwAEBycpsycH6w'

type ModalMode = 'date' | 'category' | 'portions' | undefined

function Home(props: { user?: User }) {
    const navigate = useNavigate()

    // User
    const user = getAuth().currentUser

    // Map
    const [centerCoords, setCenterCoords] = useState([42.2808, -83.743])
    const [zoom, setZoom] = useState(15)
    const userLoc = useRef<GeolocateControlRef>(null)

    // Bottom Sheet
    const [open, setOpen] = useState(true)
    const [modalMode, setModalMode] = useState<ModalMode>(undefined)

    // Filters
    const [date, setDate] = useState<moment.Moment>(moment()) // unix time
    const [category, setCategory] = useState(categories[0])
    const [portionSize, setPortionSize] = useState<number>(1)

    // Content
    const [meals, setMeals] = useState<Meal[]>([])
    const [isLoadingMeals, setIsLoadingMeals] = useState(true)

    const fetchMeals = async () => {
        setIsLoadingMeals(true)
        const meals = await getMeals({
            portionSize,
            category,
            location: { _latitude: centerCoords[0], _longitude: centerCoords[1] }
        })
        setMeals(meals)
        setIsLoadingMeals(false)
    }

    useEffect(() => {
        fetchMeals()
    }, [])

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <ReactMapGL
                style={{ height: '100%', width: '100%' }}
                mapboxAccessToken={MAPBOX_API_KEY}
                mapStyle={'mapbox://styles/mapbox/streets-v9'}
                // onViewportChange={this.props.updateViewport}
                dragRotate={false}
                maxPitch={0}
                initialViewState={{
                    latitude: centerCoords[0],
                    longitude: centerCoords[1],
                    zoom,
                    padding: {
                        bottom: window.innerHeight * 0.6,
                        top: 0,
                        left: 0,
                        right: 0
                    }
                }}
                onLoad={() => {
                    userLoc.current?.trigger()
                }}
            >
                <GeolocateControl
                    onGeolocate={e => {
                        console.log('onGeolocate:', e)
                        setCenterCoords([e.coords.latitude, e.coords.longitude])
                    }}
                    onError={e => console.log('onError:', e)}
                    showUserLocation
                    ref={userLoc}
                    style={{ marginTop: 76, marginRight: 24 }}
                />
                {meals.map(meal => (
                    <Marker
                        color="red"
                        latitude={meal.pickupLocation._latitude}
                        longitude={meal.pickupLocation._longitude}
                    />
                ))}
            </ReactMapGL>
            <BottomSheet
                open={open}
                blocking={false}
                // snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight / 0.6]}
                snapPoints={({ maxHeight }) => [150, maxHeight * 0.6]}
                defaultSnap={({ lastSnap, snapPoints }) => {
                    console.log('last snap: ', lastSnap)
                    return lastSnap ?? Math.max(...snapPoints)
                }}
                header={
                    <Header>
                        <HeaderTitle>Nearby Meals</HeaderTitle>
                        <FilterRow>
                            <FilterButton
                                title={pickupTimeFilterDisplay(date)}
                                onPress={
                                    isDesktop()
                                        ? () => {
                                              setModalMode('date')
                                              console.log('Date pressed')
                                          }
                                        : undefined
                                }
                                selected={modalMode === 'date'}
                            >
                                {!isDesktop() && (
                                    <DatePickerSheet
                                        value={date}
                                        onValueChange={val => setDate(val)}
                                        onCancel={() => setModalMode(undefined)}
                                    />
                                )}
                            </FilterButton>
                            <FilterButton title={category} selected={modalMode === 'category'}>
                                <CategorySheet
                                    onCancel={() => setModalMode(undefined)}
                                    onValueChange={val => setCategory(val)}
                                />
                            </FilterButton>
                            <FilterButton
                                title={`${portionSize} Portion${portionSize === 1 ? '' : 's'}`}
                                onPress={() => setModalMode('portions')}
                                selected={modalMode === 'portions'}
                            />
                        </FilterRow>
                    </Header>
                }
            >
                {isLoadingMeals && meals.length === 0 ? (
                    <h4>Loading...</h4>
                ) : meals.length ? (
                    meals.map(meal => (
                        <MealRow
                            meal={meal}
                            userLoc={{ _latitude: centerCoords[0], _longitude: centerCoords[1] }}
                        />
                    ))
                ) : (
                    <h1>No Meals Found Nearby</h1>
                )}
            </BottomSheet>
            {modalMode === 'date' && isDesktop() && (
                <DatePickerSheet
                    value={date}
                    onValueChange={val => setDate(val)}
                    onCancel={() => setModalMode(undefined)}
                />
            )}
            {modalMode === 'portions' && (
                <PortionSizeSheet
                    onCancel={() => setModalMode(undefined)}
                    value={portionSize}
                    onValueChange={v => setPortionSize(v)}
                />
            )}
            <ProfileWrapper
                onClick={async () => {
                    if (!user) {
                        try {
                            await login()
                        } catch (e) {
                            return
                        }
                    }

                    navigate('/profile')
                }}
            >
                <ProfileButton />
            </ProfileWrapper>
        </div>
    )
}

export default Home

const Header = styled.div`
    padding: 4px 8px;
    padding-top: 0px;
`
const HeaderTitle = styled.p`
    text-align: left;
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 4px;
`
const FilterRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`
const ProfileWrapper = styled.div`
    -webkit-box-shadow: 0px 10px 25px 0px rgba(0, 0, 0, 0.24);
    -moz-box-shadow: 0px 10px 25px 0px rgba(0, 0, 0, 0.24);
    box-shadow: 0px 10px 25px 0px rgba(0, 0, 0, 0.24);
`
const ProfileButton = styled.image`
    width: 50px;
    height: 50px;
    background-color: grey;
    border-radius: 25px;
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
`
