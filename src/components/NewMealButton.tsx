import IonIcon from '@reacticons/ionicons'
import styled from 'styled-components'
import { lightColors } from '../utils/Colors'

const NewMealButton = (props: { onPress: () => void }) => (
    <Container className="btn" onClick={props.onPress}>
        <PlusWrapper>
            <IonIcon style={{ width: 22, height: 22, color: 'white' }} name="add-outline" />
        </PlusWrapper>
        <NewMealButtonTitle>Cook a Meal</NewMealButtonTitle>
        <IonIcon
            style={{
                color: lightColors.tertiaryLabel,
                width: 20,
                height: 20,
                marginLeft: 8,
                marginRight: 8
            }}
            name="chevron-forward-outline"
        />
    </Container>
)

export default NewMealButton

const Container = styled.div`
    background-color: rgba(217, 217, 217, 0.6);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-top: 16px;
`
const NewMealButtonTitle = styled.p`
    font-weight: 500;
    font-size: 17px;
    flex-grow: 1;
    text-align: left;
`
const PlusWrapper = styled.div`
    background-color: ${lightColors.link};
    border-radius: 20px;
    height: 24px;
    width: 24px;
    margin: 8px;
`
