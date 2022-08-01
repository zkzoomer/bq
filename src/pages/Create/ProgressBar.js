import styled from "styled-components"

import { ProgressButton } from "../../components/Button"
import { theme } from "../../theme"

const SectionTitle = styled.div`
    font-family: 'Inter Bold';
    font-size: 2rem;
    color: var(--alt-text);
    padding-top: 30px;
    padding-bottom: 15px;
`

const ProgressBarWrapper = styled.div`
    padding-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;
`

const UnitingBar = styled.hr`
    width: 220px;
    border-top: 2px solid var(--divider);
    margin-left: 10px;
    margin-right: 10px;

    @media (max-width: ${theme.breakpoint}px) {
        width: 30%;
    }
`

export default function ProgressBar ({ isActive, setIsActive, isCompleted }) {
    return(
        <>
            <SectionTitle>
                Create your own credentials in two simple steps
            </SectionTitle>
            <ProgressBarWrapper>
                <ProgressButton isActive={isActive === 1} isCompleted={isCompleted[0]} onClick={() => setIsActive(1)}>
                    1
                </ProgressButton>
                <UnitingBar />
                <ProgressButton isActive={isActive === 2} isCompleted={isCompleted[1]} onClick={() => setIsActive(2)}>
                    2
                </ProgressButton>
            </ProgressBarWrapper>
        </>

    )
}