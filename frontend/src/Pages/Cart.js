import React, { useContext, useState, useEffect } from 'react'
import Layout from '../Components/Layout/Layout'
import { useCart } from '../Context/cartContext'
import authContext from '../Context/authContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Cart() {
    const [cart, setCart] = useCart()
    const { auth } = useContext(authContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    console.log(cart)

  

    const totalPrice = () => {
        let total = 0;
        cart.map((item) => total = total + item.price)
        return total
    }


const handleRemove = async (cartP) => {
    try {

        const res = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/removefromcart`, {
            data: { productId: cartP._id }, 
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        });

        if (res.data.success) {
            const updatedCart = cart.filter((p) => p._id !== cartP._id);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCart(updatedCart);

            toast.success(res.data.message || "Item removed from cart successfully");
        } else {
            toast.error(res.data.message || "Failed to remove item from cart");
        }
    } catch (error) {
        console.error("Error removing item from cart:", error);
        toast.error("An error occurred while removing item from cart");
    }
};


    const handlePayment = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/payments`, 
                { cart },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );
    
            if (data.success) {
                localStorage.removeItem("cart"); 
                setCart([]);                     
                navigate('/dashboard/user/all-orders'); 
                toast.success(data.message || "Payment Completed Successfully");
            } else {
                toast.error("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            toast.error("An error occurred during payment processing.");
        }
    };
    

    return (
        <Layout title="Cart - Shopease">
            <div className="flex p-4 font-Nunito bg-gray-300 min-h-screen">
              
                <div className="w-2/3 border-r">
                    <div className='text-center text-xl pt-4'>
                        {`Hello ${auth?.token && auth?.user?.name}`}
                        <div>
                            {auth.token ? cart?.length ? `You have ${cart?.length} product(s) in your Cart` : "You don't have any product in your Cart" : "Please Login"}
                        </div>
                    </div>

                    {cart && cart.map((cartP) => (
                        <div key={cartP.id} className="flex items-center space-x-4 p-4 border-b ">
                           
                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${cartP._id}`} alt={cartP.name} className="w-64 object-cover" />
                          
                            <div className='pl-8 '>
                                <h3 className="text-lg font-semibold">{cartP.name}</h3>
                                <p className=" text-gray-700 text-sm">{cartP.description.length>20 ? `${cartP.description.substring(0,40)}...`:cartP.description}</p>
                                <p className="text-red-500">₹{cartP.price}</p>
                                <button className='bg-red-600 rounded p-2 text-white'
                                    onClick={() => handleRemove(cartP)}
                                >Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                
                <div className="w-1/3 p-4 font-Nunito">
                    {/* <div className="text-xl font-bold mb-4 text-center">Cart Summary</div> */}
                    <h1 className='text-xl mt-4 py-1 mx-auto  font-Nunito border-2 border-red-600 shadow-lg w-fit px-2 rounded font-bold'>
                        Your Order
                    </h1>

                    <div className="text-center my-4">Total | Payment | CheckOut</div>
                    <hr />

                    <div className="text-lg m-6 ">

                        Total : ₹{totalPrice()}
                        {
                            auth?.user?.address ? (
                                <div>
                                    <div className='inline-block'>Current Address : </div>
                                    <div className='inline-block'> {auth?.user?.address}</div>
                                    <div className='bg-yellow-500 mt-8 rounded text-white w-fit px-2 py-1 shadow-lg '
                                        onClick={() => navigate('/dashboard/user/profile')}
                                    >Update address</div>
                                </div>

                            ) : (
                                <div>
                                    {
                                        auth?.token ? (
                                            <div className='bg-yellow-500 mt-8 rounded text-white w-fit px-2 py-1 shadow-lg '
                                                onClick={() => navigate('/dashboard/user/profile')}
                                            >Update address</div>
                                        ) : (
                                            <button className='bg-yellow-500 px-2 py-1 rounded text-white mt-8 shadow-lg'
                                                onClick={() => navigate('/login', {
                                                    state: '/cart'
                                                })}
                                            >Login to checkout</button>
                                        )
                                    }
                                </div>
                            )


                        }

                    </div>

                    {
                        !auth?.user || !cart.length ? ("") : (

                            <div className="p-2 border-2">
                                <button className='bg-yellow-500 px-2 py-1 rounded'
                                    onClick={handlePayment}
                                >
                                    Make Payment
                                </button>
                            </div>
                        )
                    }


                  
                </div>
            </div>

        </Layout>
    )
}




