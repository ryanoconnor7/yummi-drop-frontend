import styled from 'styled-components'

const FilterButton = (props: {
    title: string
    onPress?: () => void
    selected: boolean
    children?: any
}) => {
    return (
        <Container onClick={props.onPress} className="btn">
            <Title>{props.title}</Title>
            <ChevronDown />
            {props.children}
        </Container>
    )
}

export default FilterButton

const Container = styled.div`
    position: relative;
    padding: 4px 8px;
    background-color: #d9d9d9;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 8px;
`
const Title = styled.p`
    font-weight: 500;
    font-size: 15px;
    padding-right: 6px;
`
const ChevronDown = () => (
    <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.91707 9.26129L0.241469 2.66119C-0.0804897 2.34287 -0.0804897 1.8268 0.241469 1.50852L1.02007 0.738729C1.34148 0.420957 1.86239 0.420345 2.18456 0.73737L7.50002 5.96807L12.8154 0.73737C13.1376 0.420345 13.6585 0.420957 13.9799 0.738729L14.7585 1.50852C15.0805 1.82684 15.0805 2.34291 14.7585 2.66119L8.08296 9.26129C7.76101 9.57957 7.23903 9.57957 6.91707 9.26129Z"
            fill="black"
        />
    </svg>
)
