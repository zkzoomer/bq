import { useEffect, useState } from "react"
import moment from 'moment';
import styled from "styled-components"
import Datetime from 'react-datetime';

import { InputWrapper, InputName, ErrorText } from './SubmitCredential';
import "../../styles/react-datetime.css";

const DatetimeWrapper = styled.div`
    width: 100%;
    height: 33px;
    border-radius: 5px;
    margin: 4px 0px 4px 0px;
    box-shadow: 2px 2px 2px 1px var(--main-text);
    border: 1px solid var(--main-text);
    text-align: justify;
    text-justify: inter-word;

    transition: all 0.1s ease-in-out;

    ::placeholder {
        font-family: 'Inter ExtraLightItalic';
    }

    &:focus {
        outline: 0;
        border: 1px solid var(--alt-text);
        box-shadow: 0 0 0 white;
        margin: 6px 0px 2px 0px;
    }
`

const datetimeProps = {
    placeholder: 'Leave empty for unlimited',
    height: '33px',
};

export default function TimeLimitInput ({ value, error, setValue, setError }) {

    
    var yesterday = moment().subtract( 1, 'day' );
    var isValidDate = function( current ){
        return current.isAfter( yesterday );
    };

    const handleChange = (_value) => {
        const unixTime = _value.unix()
        const currentUnixTime = moment().unix()
        if (currentUnixTime > unixTime) {
            setError('Invalid time limit')
        } else {
            setValue(unixTime)
        }
    }

    // validating input onChange, setting it to unix time that is in accord with blockchain time for ez submission on handleSubmit in props

    return(
        <InputWrapper>
            <InputName>Test deadline</InputName>
            <DatetimeWrapper>
                <Datetime 
                    value={value === "" ? null : new Date(value*1000)}
                    onChange={handleChange}
                    isValidDate={isValidDate}
                    inputProps={datetimeProps}
                />
            </DatetimeWrapper>
            <ErrorText>{error}</ErrorText>
        </InputWrapper>
    )
}