import { useSelector } from "react-redux"
import WalletModal from "../WalletModal";

export default function TopLevelModals ({ isOpen, closeModal }) {
    const modalShowing = useSelector(state => state.modal.modalShowing);

    if (modalShowing === 'connect-wallet') {
        return(
            <WalletModal isOpen={isOpen} closeModal={closeModal} />
        )
    } else {
        return(
            <div />
        )
    }
    
}