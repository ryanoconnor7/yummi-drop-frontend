import { User as FBUser } from 'firebase/auth'
import { User, categories } from '../types/Types'
import styled from 'styled-components'
import { Back } from './Profile'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import { lightColors } from '../utils/Colors'
import { CategorySheet, isDesktop } from '../components/Sheet'
import { useState } from 'react'
import IonIcon from '@reacticons/ionicons'
import {
    DateTimeField,
    DateTimePicker,
    MobileDateTimePicker,
    StaticDateTimePicker
} from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import moment, { Moment } from 'moment'
import { pickupTimeFilterDisplay, timeRounded } from '../utils/TimeUtils'
import { ReserveButton } from './MealDetail'
import _ from 'lodash'
import PortionSize from '../components/PortionSize'
import { useFilePicker } from 'use-file-picker'
import { Position, createMeal } from '../types/Meal'
import { getCurrentLocation } from '../utils/LocationUtils'

const NewMeal = (props: { user?: User; fbUser?: FBUser | null }) => {
    const navigate = useNavigate()

    // Field values
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string | undefined>(undefined)
    const [date, setDate] = useState<Moment>(timeRounded(moment().add(1, 'hour')))
    const [calories, setCalories] = useState<number>(-1)
    const [ingredients, setIngredients] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [price, setPrice] = useState<number>(-1)
    const [priceStr, setPriceStr] = useState<string>('')
    const [portions, setPortions] = useState<number>(4)
    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        accept: 'image/*',
        multiple: false,
        readAs: 'DataURL'
    })
    const [pickUpLocation, setPickupLocation] = useState<Position | undefined>()

    // State
    const [isCreating, setIsCreating] = useState(false)
    const [isLocating, setIsLocating] = useState(false)

    const inputIsValid = () =>
        !_.isUndefined(category) &&
        !_.isEmpty(title) &&
        !_.isEmpty(ingredients) &&
        !_.isNil(pickUpLocation) &&
        price > 0 &&
        filesContent.length > 0 &&
        calories > 0

    const createButtonDisabled = isCreating || !inputIsValid()
    const createPressed = async () => {
        setIsCreating(true)

        try {
            // const buffer = await filesContent[0]
            const meal = await createMeal(
                props.fbUser!,
                {
                    calories,
                    cost: price,
                    category: category!,
                    title,
                    pickupLocation: [pickUpLocation!._latitude, pickUpLocation!._longitude],
                    summary: description,
                    portions,
                    pickupTime: date.format()
                },
                filesContent[0]?.content,
                filesContent[0]?.name
            )
            navigate(-1)
        } catch (e) {
            console.log('Error creating meal', e)
            alert('Error creating meal')
        }

        setIsCreating(false)
    }
    const locatePressed = async () => {
        setIsLocating(true)
        try {
            const loc = await getCurrentLocation()
            setPickupLocation(loc)
        } catch (e) {
            alert('Failed to get current location ')
        }
        setIsLocating(false)
    }

    let priceError
    if (price === 0) {
        priceError = 'Price must be greater than 0'
    }

    return (
        <Modal onCancel={() => {}} backButton="none">
            <Container>
                <Back className="btn" onClick={() => navigate('/profile')}>
                    <Cancel>Cancel</Cancel>
                </Back>
                <Title>Add New Meal</Title>
                <Content>
                    <FieldTitle style={{ marginTop: 0 }}>Name</FieldTitle>
                    <Field
                        placeholder="A short title for your dish..."
                        onChange={e => setTitle(e.currentTarget.value)}
                    />
                    <FieldTitle>Category</FieldTitle>
                    <CategoryButton className="btn">
                        <CategorySheet
                            onCancel={() => {}}
                            onValueChange={val => setCategory(val)}
                            showAll={false}
                        />
                        <CategoryButtonText>{category ?? 'Select'}</CategoryButtonText>
                    </CategoryButton>
                    <FieldTitle style={{ marginBottom: 2 }}>Total Portions</FieldTitle>
                    <PortionsWrapper>
                        <PortionSize
                            minValue={1}
                            maxValue={8}
                            setValue={val => setPortions(val)}
                            value={portions}
                            size={18}
                        />
                        <PortionsSubtitle>portions</PortionsSubtitle>
                    </PortionsWrapper>
                    <FieldTitle>Pickup Time</FieldTitle>
                    <CategoryButton className="btn">
                        <CategoryButtonText>
                            {date ? pickupTimeFilterDisplay(date, true) : 'Select'}
                        </CategoryButtonText>
                        <DateWrapper>
                            <MobileDateTimePicker
                                slotProps={{
                                    textField: {
                                        style: {
                                            width: '100%',
                                            height: '100%'
                                        }
                                    }
                                }}
                                defaultValue={dayjs.unix(date.unix())}
                                minDateTime={dayjs()}
                                maxDateTime={dayjs().add(7, 'days')}
                                onChange={val => {
                                    console.log('VAL: ', val)

                                    if (!val) return
                                    // Round time
                                    const rawDate = timeRounded(moment.unix(val.unix()))

                                    setDate(rawDate)
                                }}
                            />
                        </DateWrapper>
                    </CategoryButton>
                    <FieldTitle>Estimated Calories</FieldTitle>
                    <PortionsWrapper>
                        <Field
                            placeholder="0"
                            style={{ width: 64 }}
                            value={calories >= 0 ? calories.toString() : ''}
                            onChange={e =>
                                setCalories(+e.currentTarget.value.replace(/[^0-9]/g, ''))
                            }
                        />
                        <PortionsSubtitle>per portion</PortionsSubtitle>
                    </PortionsWrapper>
                    <FieldTitle>Ingredients</FieldTitle>
                    <Field
                        placeholder="Raw and prepared ingredients..."
                        onChange={e => setIngredients(e.currentTarget.value)}
                    />
                    <FieldTitle>Description (optional)</FieldTitle>
                    <Field
                        placeholder="What's special about this dish?"
                        onChange={e => setDescription(e.currentTarget.value)}
                    />
                    <FieldTitle>Price</FieldTitle>
                    <PortionsWrapper>
                        <Field
                            placeholder="$0.00"
                            value={price >= 0 ? `$${priceStr}` : ''}
                            onChange={e => {
                                const correctedStr = e.currentTarget.value.replace(/[^0-9.]/g, '')
                                if (
                                    RegExp(/^\d*(.\d{1,2})?$/).test(correctedStr) ||
                                    correctedStr === '' ||
                                    (correctedStr.endsWith('.') && !correctedStr.endsWith('..'))
                                ) {
                                    setPrice(parseFloat(correctedStr))
                                    setPriceStr(correctedStr)
                                } else {
                                    setPrice(-1)
                                }
                                return
                            }}
                            style={{ width: 64 }}
                        />
                        <PortionsSubtitle>per portion</PortionsSubtitle>
                    </PortionsWrapper>
                    {priceError && <ErrorText>{priceError}</ErrorText>}
                    <FieldTitle>Image</FieldTitle>
                    <ImageSubtitle>Please upload an original image of your dish</ImageSubtitle>
                    <CategoryButton className="btn" onClick={openFileSelector}>
                        <CategoryButtonText>{filesContent[0]?.name ?? 'Select'}</CategoryButtonText>
                    </CategoryButton>
                    <FieldTitle>Pickup Location</FieldTitle>
                    <ImageSubtitle>Current location required</ImageSubtitle>
                    <CategoryButton className="btn" onClick={locatePressed}>
                        <IonIcon
                            name="navigate"
                            color={lightColors.link}
                            style={{ width: 18, height: 18, marginRight: 8 }}
                        />
                        <CategoryButtonText>
                            {isLocating
                                ? 'Locating...'
                                : pickUpLocation
                                ? 'Using Current Location'
                                : 'Locate'}
                        </CategoryButtonText>
                    </CategoryButton>
                    <ReserveButton
                        onClick={createButtonDisabled ? undefined : createPressed}
                        className={createButtonDisabled ? undefined : 'btn'}
                        style={{
                            opacity: createButtonDisabled ? 0.5 : 1.0,
                            paddingTop: 12,
                            paddingBottom: 12
                        }}
                    >
                        Create
                    </ReserveButton>
                </Content>
            </Container>
        </Modal>
    )
}

export default NewMeal

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
`

const Content = styled.div`
    max-width: 400px;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    top: 70px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    position: absolute;
    padding: 24px;
    padding-top: 0px;
`
const Cancel = styled.p`
    font-size: 16px;
    font-weight: 500;
    padding: 6px;
    padding-top: 2px;
`
const Title = styled.p`
    font-weight: 700;
    font-size: 20px;
    margin-top: 2px;
    width: 100%;
    text-align: center;
    margin-bottom: 8px;
`
const FieldTitle = styled.p`
    font-weight: 600;
    font-size: 17px;
    text-align: start;
    margin-top: 16px;
    margin-bottom: 5px;
`
const Field = styled.input`
    border-radius: 12px;
    background-color: rgba(217, 217, 217, 0.6);
    border: none;
    padding: 12px;
    font-size: 17px;
`
const CategoryButton = styled.div`
    border-radius: 12px;
    position: relative;
    background-color: rgba(217, 217, 217, 0.6);
    padding: 12px;
    color: ${lightColors.link};
    display: flex;
    flex-direction: row;
    align-items: center;
`
const CategoryButtonText = styled.p`
    font-weight: 500;
    font-size: 17px;
    pointer-events: none;
`
const DateWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
`
const PortionsWrapper = styled.div`
    flex-direction: row;
    display: flex;
    align-items: center;
`
const PortionsSubtitle = styled.p`
    font-size: 17px;
    margin-left: 6px;
`
const ErrorText = styled.p`
    font-size: 17px;
    margin-left: 6px;
    text-align: start;
    margin-top: 4px;
    color: red;
`
const ImageSubtitle = styled.p`
    font-size: 15px;
    font-style: italic;
    text-align: start;
    margin-bottom: 4px;
    color: ${lightColors.secondaryLabel};
`
