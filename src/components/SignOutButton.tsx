import IonIcon from '@reacticons/ionicons'
import styled from 'styled-components'
import { lightColors } from '../utils/Colors'

const SignOutButton = (props: { onPress: () => void }) => (
    <Container className="btn" onClick={props.onPress}>
        <NewMealButtonTitle>Sign Out</NewMealButtonTitle>
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

export default SignOutButton

const Container = styled.div`
    background-color: rgba(217, 217, 217, 0.6);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin: 8px 16px 0px 16px;
`
const NewMealButtonTitle = styled.p`
    font-weight: 500;
    font-size: 17px;
    flex-grow: 1;
    text-align: left;
    margin: 10px 12px;
`
