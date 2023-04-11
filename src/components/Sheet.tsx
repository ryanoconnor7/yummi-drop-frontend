import { DateTimePicker, StaticDateTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import moment from 'moment'
import { useState } from 'react'
import styled from 'styled-components'
import { categories } from '../types/Types'
import PortionSize from './PortionSize'

export const isDesktop = () => {
    console.log('width: ', window.innerWidth)
    return window.innerWidth >= 500
}
export interface SharedSheetProps {
    onCancel: () => void
}
export const Sheet = (props: { children?: any } & SharedSheetProps) => {
    const Content = isDesktop() ? PopupSheet : BottomSheet
    return (
        <Container>
            <Content onClick={() => {}}>{props.children}</Content>
        </Container>
    )
}

export const DatePickerSheet = (
    props: { value: moment.Moment; onValueChange: (val: moment.Moment) => void } & SharedSheetProps
) => {
    const [value, setValue] = useState(dayjs.unix(props.value.unix()))

    const DateComponent = isDesktop() ? StaticDateTimePicker : DateTimePicker
    const body = (
        <DateComponent
            defaultValue={value}
            minDateTime={dayjs()}
            maxDateTime={dayjs().add(7, 'days')}
            onChange={val => val && setValue(val)}
            onClose={props.onCancel}
            onAccept={() => {
                // Round time
                const rawDate = moment.unix(value.unix())
                const remainderMins = rawDate.minutes() % 15
                if (remainderMins !== 0) {
                    if (remainderMins < 8) {
                        rawDate.subtract(remainderMins, 'minutes')
                    } else {
                        rawDate.add(15 - remainderMins, 'minutes')
                    }
                }

                props.onValueChange(rawDate)
                props.onCancel()
            }}
        />
    )
    if (isDesktop()) {
        return <Sheet onCancel={props.onCancel}>{body}</Sheet>
    } else {
        return <InvisibleDate>{body}</InvisibleDate>
    }
}

export const CategorySheet = (
    props: { onValueChange: (val: string) => void } & SharedSheetProps
) => {
    return (
        <CategorySelect title="Category" onChange={e => props.onValueChange(e.target.value)}>
            {categories.map(c => (
                <option value={c}>{c}</option>
            ))}
        </CategorySelect>
    )
}

export const PortionSizeSheet = (
    props: { value: number; onValueChange: (val: number) => void } & SharedSheetProps
) => {
    const [value, setValue] = useState(props.value)
    return (
        <Sheet onCancel={() => {}}>
            <PortionSizeTitle>Portion Size</PortionSizeTitle>
            <PortionSize
                minValue={1}
                maxValue={8}
                setValue={val => setValue(val)}
                value={value}
                size={36}
            />
            <UpdateButton
                onClick={() => {
                    props.onValueChange(value)
                    props.onCancel()
                }}
                className="btn"
            >
                Update
            </UpdateButton>
        </Sheet>
    )
}

const Container = styled.div`
    position: absolute;
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
`
const BaseSheet = styled.div`
    padding: 24px;
    background-color: white;
    z-index: 102;
`
const BottomSheet = styled(BaseSheet)`
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
`
const PopupSheet = styled(BaseSheet)`
    border-radius: 24px;
`

// --- DATE ---

const InvisibleDate = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
`

// --- CATEGORY ---
const CategorySelect = styled.select`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
`

// --- PORTION SIZE ---
const PortionSizeTitle = styled.p`
    font-weight: 700;
    font-size: 18px;
    text-align: left;
`
const UpdateButton = styled.p`
    font-weight: 500;
    font-size: 17px;
    text-justify: center;
    align-content: center;
    background-color: black;
    color: white;
    padding: 8px;
    border-radius: 10px;
`
