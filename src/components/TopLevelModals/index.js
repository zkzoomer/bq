import { useDispatch, useSelector } from "react-redux"

import { setError } from '../../state/error/reducer';
import ErrorModal from "../ErrorModal";
import WalletModal from "../WalletModal";


export default function TopLevelModals ({ isOpen, closeModal }) {
    const dispatch = useDispatch()
    const modalShowing = useSelector(state => state.modal.modalShowing);
    const errorMessage = useSelector(state => state.error.errorMessage);

    if (modalShowing === 'connect-wallet') {
        return(
            <>
                <WalletModal isOpen={isOpen} closeModal={closeModal} />
                <ErrorModal 
                    errorMessage={errorMessage}
                    closeModal={() => {dispatch(setError([])); closeModal()}}
                />
            </>
        )
    } else {
        return(
            <ErrorModal 
                errorMessage={errorMessage}
                closeModal={() => {dispatch(setError([])); closeModal()}}
            />
        )
    }
    
}