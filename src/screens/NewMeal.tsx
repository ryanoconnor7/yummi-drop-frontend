import { User as FBUser } from 'firebase/auth'
import { User } from '../types/Types'
import styled from 'styled-components'
import { Back } from './Profile'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'

const NewMeal = (props: { user?: User; fbUser?: FBUser | null }) => {
    const navigate = useNavigate()
    return (
        <Modal onCancel={() => {}} backButton="none">
            <Container>
                <Back className="btn" onClick={() => navigate('/profile')}>
                    <Cancel>Cancel</Cancel>
                </Back>
                <Content>
                    <Title>Add New Meal</Title>
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
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
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
`
