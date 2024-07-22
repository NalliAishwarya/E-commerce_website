import React ,{createContext, useEffect, useState}from "react";
// import all_product from '../Components/Assets/Frontend_Assets/all_product'



export const ShopContext = createContext(null);
const getDefaultCart =()=>{
    let cart={};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
        
    }
    return cart;
}
const ShopContextProvider=(props)=>{
    const[all_product,setAll_Product]=useState([]);
    const [cartItems,setCartItems]=useState(getDefaultCart());

    useEffect(()=>{
        fetch('https://e-commerce-website-backend-y6r5.onrender.com/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-website-backend-y6r5.onrender.com/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data))
        }
    },[])
    
    const addToCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        if (localStorage.getItem('auth-token')){
            fetch('https://e-commerce-website-backend-y6r5.onrender.com/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    const removefromCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-website-backend-y6r5.onrender.com/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    const getTotalcartamount=()=>{
        let totamt=0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                let itemInfo=all_product.find((product)=>product.id===Number(item))
                totamt+=itemInfo.new_price * cartItems[item];
            }
            
        }
        return totamt
    }
    const gettotalcartitems=()=>{
        let totit=0;
        for(const item in cartItems)
        {
            if (cartItems[item]>0)
            {
                totit+=cartItems[item];
            }
        }
        return totit;
    }
    const contextValue={gettotalcartitems,all_product,cartItems,addToCart,removefromCart,getTotalcartamount};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;
