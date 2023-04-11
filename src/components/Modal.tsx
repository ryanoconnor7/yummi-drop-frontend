import styled from 'styled-components'
import { SharedSheetProps, isDesktop } from './Sheet'
import { Back } from '../screens/Profile'
import { useNavigate } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'

const Modal = (
    props: { children?: any; backButton?: 'default' | 'none' | 'prominent' } & SharedSheetProps
) => {
    const Content = isDesktop() ? PopupSheet : FullSheet
    const navigate = useNavigate()

    return (
        <Container>
            <Content>
                {props.backButton !== 'none' && (
                    <Back
                        style={
                            props.backButton === 'prominent'
                                ? {
                                      backgroundColor: '#FFFFFF',
                                      boxShadow: '0px 4px 12px #00000070'
                                  }
                                : {}
                        }
                        onClick={() => navigate('/')}
                        className="btn"
                    >
                        <IonIcon style={{ height: 26, width: 26 }} name="close-outline" />
                    </Back>
                )}
                {props.children}
            </Content>
        </Container>
    )
}

export default Modal

const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #00000040;
    z-index: 101;
    display: flex;
    align-items: center;
    justify-content: center;
`
const BaseSheet = styled.div`
    background-color: white;
    z-index: 102;
`
const FullSheet = styled(BaseSheet)`
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
`
const PopupSheet = styled(BaseSheet)`
    border-radius: 24px;
    overflow: hidden;
    max-width: 400px;
    width: 100%;
    max-height: 80%;
    height: 100%;
    position: relative;
`
