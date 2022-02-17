import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #FAFAFB;
`;

const SubContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const FormWrapper = styled.div`
  width:100%;
  bottom: 0;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`

const FormContainer = styled.div`
  width:100%;
  bottom: 0px;
  margin: auto;
`;

const Form = styled.form`
  padding: 20px 0px; 
  text-align: left;
`;

const GameLength = styled.div`
    display: ${props => props.display ? 'block' : 'none'};
`;

export default {
    Container,
    SubContainer,
    FormWrapper,
    FormContainer,
    Form,
    GameLength
};