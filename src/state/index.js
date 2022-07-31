import { configureStore } from '@reduxjs/toolkit'

import chain from './chain/reducer';
import modal from './modal/reducer';
import sidebar from './sidebar/reducer';

const store = configureStore({
    reducer: {
        chain,
        modal,
        sidebar,
    }
})

export default store