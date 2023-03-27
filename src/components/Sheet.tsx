import { useState } from 'react'
import styled from 'styled-components'
import { categories } from '../Types'

interface SharedSheetProps {
    onCancel: () => void
}
export const Sheet = (props: { children?: any } & SharedSheetProps) => {
    return (
        <Container onClick={props.onCancel}>
            <BottomSheet onClick={() => {}}>{props.children}</BottomSheet>
        </Container>
    )
}

export const DatePickerSheet = (props: {} & SharedSheetProps) => {
    return <Sheet onCancel={props.onCancel}></Sheet>
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
            <Row style={{ marginTop: 16, marginBottom: 16 }}>
                <div style={{ flexGrow: 1 }} />
                <PortionSizeButton
                    className="btn"
                    style={{ opacity: value > 1 ? 1 : 0.5 }}
                    onClick={value > 1 ? () => setValue(value - 1) : undefined}
                >
                    –
                </PortionSizeButton>
                <PortionSizeQuantity>{value}</PortionSizeQuantity>
                <PortionSizeButton
                    className="btn"
                    style={{ opacity: value < 8 ? 1 : 0.5 }}
                    onClick={value < 8 ? () => setValue(value + 1) : undefined}
                >
                    +
                </PortionSizeButton>
                <div style={{ flexGrow: 1 }} />
            </Row>
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
`
const BottomSheet = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px;
    background-color: white;
    z-index: 102;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
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
const PortionSizeQuantity = styled.div`
    font-weight: 600;
    font-size: 36px;
    margin: 24px;
    font-variant-numeric: tabular-nums;
    user-select: none;
`
const PortionSizeButton = styled.p`
    font-weight: 500;
    font-size: 36px;
    width: 51px;
    height: 51px;
    background: #d9d9d9;
    border-radius: 26px;
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
