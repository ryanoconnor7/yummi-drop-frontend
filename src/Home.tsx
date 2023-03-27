import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { lightColors } from './Colors'
import { BottomSheet } from 'react-spring-bottom-sheet'
import { useState } from 'react'
import styled from 'styled-components'
import { categories, testMeals } from './Types'
import MealRow from './components/MealRow'
import FilterButton from './components/FilterButton'
import { CategorySheet, DatePickerSheet, PortionSizeSheet } from './components/Sheet'

const Map = ReactMapboxGl({
    accessToken:
        'pk.eyJ1Ijoicnlhbm9jb25ub3I3IiwiYSI6ImNsZm45NGl4NTAycms0M3Qya3EyOG55YzYifQ.KmSgNqJREwAEBycpsycH6w'
})

type ModalMode = 'date' | 'category' | 'portions' | undefined

function Home() {
    const initialCoords = [-83.743, 42.2808]
    const [open, setOpen] = useState(true)
    const [modalMode, setModalMode] = useState<ModalMode>(undefined)

    // Filters
    const [category, setCategory] = useState(categories[0])
    const [portionSize, setPortionSize] = useState<number>(1)

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <Map
                style="mapbox://styles/mapbox/streets-v9"
                containerStyle={{
                    height: '100vh',
                    width: '100vw'
                }}
                center={initialCoords as [number, number]}
                zoom={[14]}
            >
                <Marker coordinates={initialCoords}>
                    <div
                        style={{
                            backgroundColor: lightColors.link,
                            width: 20,
                            height: 20,
                            borderRadius: 20,
                            border: 'solid white',
                            borderWidth: '4px',
                            overflow: 'visible'
                        }}
                    />
                </Marker>
            </Map>
            <BottomSheet
                open={open}
                onDismiss={() => setOpen(false)}
                blocking={false}
                header={
                    <Header>
                        <HeaderTitle>Nearby Meals</HeaderTitle>
                        <FilterRow>
                            <FilterButton
                                title="Now"
                                onPress={() => {
                                    setModalMode('date')
                                    console.log('Date pressed')
                                }}
                                selected={modalMode === 'date'}
                            />
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
                snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6]}
            >
                {testMeals.map(meal => (
                    <MealRow meal={meal} />
                ))}
            </BottomSheet>
            {modalMode === 'date' && <DatePickerSheet onCancel={() => setModalMode(undefined)} />}

            {modalMode === 'portions' && (
                <PortionSizeSheet
                    onCancel={() => setModalMode(undefined)}
                    value={portionSize}
                    onValueChange={v => setPortionSize(v)}
                />
            )}
        </div>
    )
}

export default Home

const Header = styled.div`
    padding: 4px 8px;
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
`
