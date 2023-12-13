import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {githubApi} from "../rtk/query-services/github.api";
import {setupListeners} from "@reduxjs/toolkit/query";
import {githubReducer} from "../rtk/reducers/github.slice";

const rootReducer = combineReducers({
    [githubApi.reducerPath]: githubApi.reducer,
    github: githubReducer
})

export const setupStore = () => {
    return configureStore ({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(githubApi.middleware)
    })
}

setupListeners(setupStore().dispatch)

export type RootState = ReturnType<typeof rootReducer>

export type AppStore = ReturnType<typeof setupStore>

export type AppDispatch = AppStore['dispatch']