import ReactMapGL, {
    GeolocateControl,
    ViewState,
    GeolocateControlRef,
    Marker,
    useMap,
    MapRef
} from 'react-map-gl'
import mapboxgl from 'mapbox-gl' // This is a dependency of react-map-gl even if you didn't explicitly install it
import 'mapbox-gl/dist/mapbox-gl.css'
import { lightColors } from '../utils/Colors'
import { BottomSheet } from 'react-spring-bottom-sheet'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { User, categories } from '../types/Types'
import MealRow from '../components/MealRow'
import FilterButton from '../components/FilterButton'
import {
    CategorySheet,
    DatePickerSheet,
    isDesktop,
    PortionSizeSheet,
    Sheet
} from '../components/Sheet'
import moment from 'moment'
import { pickupTimeFilterDisplay, shortTime } from '../utils/TimeUtils'
import { getMeals, Meal, Position, testMeals } from '../types/Meal'
import { Outlet, useNavigate } from 'react-router-dom'
import { login } from './Login'
import { auth } from '../App'
import { getAuth } from 'firebase/auth'
import { PuffLoader } from 'react-spinners'
import IonIcon from '@reacticons/ionicons'
import { bboxOfMeals, getCurrentLocation, getMapPadding } from '../utils/LocationUtils'
import { BBox, center } from '@turf/turf'

// @ts-ignore
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default // eslint-disable-line import/no-webpack-loader-syntax
export const MAPBOX_API_KEY =
    'pk.eyJ1Ijoicnlhbm9jb25ub3I3IiwiYSI6ImNsZm45NGl4NTAycms0M3Qya3EyOG55YzYifQ.KmSgNqJREwAEBycpsycH6w'

type ModalMode = 'date' | 'category' | 'portions' | undefined

function Home(props: { user?: User }) {
    const navigate = useNavigate()

    // User
    const user = getAuth().currentUser

    // Map
    const [centerCoords, setCenterCoords] = useState([42.2808, -83.743])
    const [zoom, setZoom] = useState(15)
    const [userLocated, setUserLocated] = useState(false)
    const userLoc = useRef<GeolocateControlRef>(null)
    const mapRef = useRef<MapRef>()

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

    const locateUser = async () => {
        const defaultCoords = {
            _latitude: centerCoords[0],
            _longitude: centerCoords[1]
        }

        if (userLocated) return defaultCoords
        const loc = await getCurrentLocation()
        console.log('User loc:', loc)

        if (loc) {
            setCenterCoords([loc._latitude, loc._longitude])
            setUserLocated(true)
        }
        return loc ?? defaultCoords
    }
    const fetchMeals = async () => {
        console.log('Center coords: ', centerCoords)
        setIsLoadingMeals(true)
        setMeals([])
        try {
            let userLoc = await locateUser()

            const meals = await getMeals({
                portionSize,
                category,
                lat: userLoc!._latitude,
                lon: userLoc!._longitude,
                pickupDate: date.toString()
            })
            setMeals(meals)
            const bbox = bboxOfMeals(meals, userLoc)

            mapRef.current?.fitBounds(bbox as [number, number, number, number], {
                padding: 24
            })
        } catch (e) {
            console.log('Fetch meals error:', e)
            setMeals([])
        }
        setIsLoadingMeals(false)
    }

    useEffect(() => {
        fetchMeals()
    }, [category, date, portionSize])

    useEffect(() => {})

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <ReactMapGL
                ref={mapRef as any}
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
                    padding: getMapPadding(true)
                }}
                onLoad={() => {
                    userLoc.current?.trigger()
                }}
            >
                {/* {userLocated && ( */}
                <GeolocateControl
                    onGeolocate={e => {
                        console.log('onGeolocate:', e)
                        setCenterCoords([e.coords.latitude, e.coords.longitude])
                        const bbox = bboxOfMeals(meals, {
                            _latitude: e.coords.latitude,
                            _longitude: e.coords.longitude
                        })
                        mapRef.current?.fitBounds(bbox as [number, number, number, number], {
                            padding: 24
                        })
                    }}
                    onError={e => console.log('onError:', e)}
                    showUserLocation
                    ref={userLoc}
                    style={{ visibility: 'hidden' }}
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
                    <SpinnerWrapper>
                        <PuffLoader color={lightColors.fillaBlue} />
                    </SpinnerWrapper>
                ) : meals.length ? (
                    meals.map((meal, i) => (
                        <MealRow
                            key={meal.id}
                            meal={meal}
                            userLoc={{ _latitude: centerCoords[0], _longitude: centerCoords[1] }}
                            onPress={() =>
                                navigate('meal/1234', { state: { meal, portions: portionSize } })
                            }
                        />
                    ))
                ) : (
                    <NoMealsWrapper>
                        <NoMeals>No Meals Found Nearby</NoMeals>
                        <TryAgainButton className="btn" onClick={() => fetchMeals()}>
                            <IonIcon
                                name="refresh-outline"
                                style={{ marginRight: 4, color: 'white', width: 20, height: 20 }}
                            />
                            Refresh
                        </TryAgainButton>
                    </NoMealsWrapper>
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
                <ProfileButton src={user?.photoURL ?? undefined} />
            </ProfileWrapper>
            <Outlet />
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
const ProfileButton = styled.img`
    width: 50px;
    height: 50px;
    background-color: grey;
    border-radius: 25px;
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
`
const SpinnerWrapper = styled.div`
    width: 100%;
    margin-top: 24px;
    padding: 24px;
    padding-left: 0px;
    justify-content: center;
    display: flex;
`
const NoMealsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 24px;
`
const NoMeals = styled.p`
    font-size: 20px;
    font-weight: 500;
    font-style: italic;
`
const TryAgainButton = styled.div`
    padding: 8px 12px;
    border-radius: 50px;
    background-color: ${lightColors.link};
    font-size: 18px;
    font-weight: 500;
    color: white;
    margin-top: 12px;
    display: flex;
    align-items: center;
`
