import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/Admin_Assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  // const fetchInfo = async () => {
  //   await fetch('https://e-commerce-website-backend-y6r5.onrender.com')
  //     .then((res) => res.json())
  //     .then((data) => { setAllProducts(data); });
  // };

  // useEffect(() => {
  //   fetchInfo();
  // }, []);

  // const remove_product = async (id) => {
  //   await fetch('https://e-commerce-website-backend-y6r5.onrender.com', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ id: id }),
  //   });
  //   await fetchInfo();
  // };
const fetchInfo = async () => {
  await fetch('https://e-commerce-website-backend-y6r5.onrender.com/allproducts')
    .then((res) => res.json())
    .then((data) => {
      setAllProducts(data);
    });
};

const remove_product = async (id) => {
  await fetch(`https://e-commerce-website-backend-y6r5.onrender.com/removeproduct`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id }),
  });
  await fetchInfo();
};

  return (
    <div className='listproduct'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={() => { remove_product(product.id) }} className='listproduct-cross-icon' src={cross_icon} alt="" />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;

// import React, { useEffect, useState } from 'react'
// import './ListProduct.css'
// import cross_icon from '../../assets/Admin_Assets/cross_icon.png'
// const ListProduct = () => {
//   const [allproducts,setAllProducts]=useState([]);

//   const fetchInfo=async()=>{
//     await fetch('http://localhost:4000/allproducts')
//     .then((res)=>res.json())
//     .then((data)=>{setAllProducts(data)});
//   }
//   useEffect(()=>{
//     fetchInfo();
//   },[])

//   const remove_product= async (id)=>{
//     await fetch('http://localhost:4000/removeproduct',{
//       method:'POST',
//       headers:{
//         Accept:'application/json',
//         'Content-Type':'application/json',
//       },
//       body:JSON.stringify({id:id})
//     })
//     await fetchInfo();
//   }

//   return (
//     <div className='listproduct'>
//       <h1>All Products List</h1>
//       <div className="listproduct-format-main">
//         <p>Products</p>
//         <p>Title</p>
//         <p>Old Price</p>
//         <p>New Price</p>
//         <p>Category</p>
//         <p>Remove</p>
//       </div>
//       <div className="listproduct-allproducts">
//         <hr />
//         {allproducts.map((product,index)=>{
//           return <><div key={index} className="listproduct-format-main listproduct-format">
//               <img src={product.image} alt="" className="listproduct-product-icon" />
//               <p>{product.name}</p>
//               <p>${product.old_price}</p>
//               <p>${product.new_price}</p>
//               <p>{product.category}</p>
//               <img onClick={()=>{remove_product(product.id)}}className='listproduct-cross-icon' src={cross_icon}alt="" />
//           </div>
//           <hr />
//           </>
//         })}
//       </div>
//     </div>
//   )
// }

// export default ListProduct
