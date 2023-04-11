import styled from 'styled-components'

const PortionSize = (props: {
    minValue: number
    maxValue: number
    setValue: (val: number) => void
    value: number
    size: number
}) => {
    const buttonProps: React.CSSProperties = {
        width: props.size * 1.4,
        height: props.size * 1.4,
        borderRadius: props.size + 16 / 2
    }
    return (
        <Row style={{ marginTop: props.size - 16, marginBottom: props.size - 16 }}>
            <div style={{ flexGrow: 1 }} />
            <PortionSizeButton
                className="btn"
                style={{ opacity: props.value > props.minValue ? 1 : 0.5, ...buttonProps }}
                onClick={
                    props.value > props.minValue ? () => props.setValue(props.value - 1) : undefined
                }
            >
                <PortionSizeT style={{ fontSize: props.size }}>–</PortionSizeT>
            </PortionSizeButton>
            <PortionSizeQuantity
                style={{
                    fontSize: props.size,
                    margin: props.size - 12
                }}
            >
                {props.value}
            </PortionSizeQuantity>
            <PortionSizeButton
                className="btn"
                style={{ opacity: props.value < props.maxValue ? 1 : 0.5, ...buttonProps }}
                onClick={
                    props.value < props.maxValue ? () => props.setValue(props.value + 1) : undefined
                }
            >
                <PortionSizeT style={{ fontSize: props.size }}>+</PortionSizeT>
            </PortionSizeButton>
            <div style={{ flexGrow: 1 }} />
        </Row>
    )
}

export default PortionSize

const PortionSizeQuantity = styled.div`
    font-weight: 600;
    /* margin: 24px; */
    font-variant-numeric: tabular-nums;
    user-select: none;
`
const PortionSizeButton = styled.div`
    background: #d9d9d9;
    position: relative;
`
const PortionSizeT = styled.p`
    font-weight: 500;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
