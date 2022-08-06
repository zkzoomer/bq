import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useDisclosure } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { setModal } from '../state/modal/reducer';
import TopLevelModals from "../components/TopLevelModals";
import Header from '../components/Header';
import { theme } from '../theme';
import '../styles/App.css'
import { Home } from './Home';
import ScrollToTop from '../hooks/scrollToTop';
import { Create } from './Create';
import { Profile } from './Profile';
import { Browse } from './Browse';
import { Help } from './Help';
import { NotFound } from './NotFound';
import Sidebar from '../components/Sidebar';
import { Footer } from '../components/Footer';


const BodyWrapper = styled.div`
  background-color: var(--main-background);
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  z-index: 1;

  @media (max-width: ${theme.breakpoint}px) {
    padding: 2rem 16px 16px 16px;
  }
`
// TODO: fix Page Not Found on netlify support guide, when entering a url directly like blockqualified.netlify.app/create
function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch()

  return (
    <Router>
      <ScrollToTop />
      <TopLevelModals isOpen={isOpen} closeModal={() => { onClose(); dispatch(setModal(""))}} />
      <Sidebar />
      <Header onOpen={onOpen}/>
      <BodyWrapper>  
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/browse" element={<Browse />} />
            {/* TODO: add solver pages how to do it */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BodyWrapper>
      <Footer />
    </Router>
  );
}

export default App;
