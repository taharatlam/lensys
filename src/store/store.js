import { configureStore } from '@reduxjs/toolkit'
import LoginSlice from './features/login/LoginSlice'
import UserDataSlice from './features/userdata/UserDataSlice'
import ProductDataSlice  from './features/productAdd/productAddSlice'
import productAddedInCart from './features/productAdd/productAddedInCart'
import cartCountSlice from './features/cartcount/cartCountSlice'

export const store = configureStore({
  reducer: {
    login: LoginSlice,
    userData: UserDataSlice,
    productData: ProductDataSlice,
    productAddedInCart: productAddedInCart,
    cartCountSlice: cartCountSlice,
  },
})