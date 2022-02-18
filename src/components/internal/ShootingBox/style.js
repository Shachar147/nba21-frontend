import styled from 'styled-components';

const SingleShot = styled.div`
    display: inline-block;
    padding-top: 10px;
    margin-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-top: 1px solid #eaeaea;
    width: 100%;
`;

const ShootingBox = styled.div`
  display: inline-block;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid #eaeaea;
`;

const InputStyle = styled.input`
  height: 38px;
  width: ${props => props.width ? props.width : '30%'};
  border: 1px solid #eaeaea;
  padding:0px 5px;
`;

const ButtonWrapper = styled.div`
  margin-left: 10px !important;
`;

export default {
    SingleShot,
    ShootingBox,
    InputStyle,
    ButtonWrapper,
};