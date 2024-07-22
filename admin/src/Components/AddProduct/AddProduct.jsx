import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/Admin_Assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'women',
    new_price: '',
    old_price: '',
  });

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      image: file,
    }));
  };

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };
  const addProduct = async () => {
  console.log(productDetails);
  let responseData;
  let product = productDetails;

  let formData = new FormData();
  formData.append('product', image);

  await fetch('https://e-commerce-website-backend-y6r5.onrender.com/upload', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  })
  .then((resp) => resp.json())
  .then((data) => {
    responseData = data;
  });

  if (responseData.success) {
    product.image = responseData.image_url;
    console.log(product);
    await fetch('https://e-commerce-website-backend-y6r5.onrender.com/addproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    .then((res) => res.json())
    .then((data) => {
      data.success ? alert("Product added") : alert("Failed");
    });
  }
};


  // const addProduct = async () => {
  //   console.log(productDetails);
  //   let responseData;
  //   let product=productDetails;

  //   let formData=new FormData();
  //   formData.append('product',image);

  //   await fetch('https://e-commerce-website-backend-y6r5.onrender.com',{
  //       method:'POST',
  //       headers:{
  //           Accept:'application/json',
  //       },
  //       body:formData,
  //   }).then((resp)=> resp.json()).then((data)=>{responseData=data});
  //   if(responseData.success){
  //       product.image=responseData.image_url;
  //       console.log(product);
  //       await fetch('https://e-commerce-website-backend-y6r5.onrender.com',{
  //           method:'POST',
  //           headers:{
  //               Accept:'application/json',
  //               'Content-Type':'application/json',
  //           },
  //           body:JSON.stringify(product),
  //       }).then((res)=>res.json()).then((data)=>{
  //           data.success?alert("Product added"): alert("Failed")
  //       })
  //   }
  // };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfields">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          className="text"
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfields">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            className="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfields">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            className="text"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfields">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="addproduct-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfields">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumnail-img"
            alt=""
          />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
      </div>
      <button onClick={addProduct} className="addproduct-btn">Add</button>
    </div>
  );
};

export default AddProduct;

// import React, { useState } from 'react'
// import './AddProduct.css'
// import upload_area from '../../assets/Admin_Assets/upload_area.svg'
// const AddProduct = () => {
//     const [image,setimage]=useState(false);
//     const[productDetails,setproductDetails]=useState({
//         name:"",
//         image:"",
//         category:"women",
//         new_price:"",
//         old_price:""
//     })

//     const imagehandler=(e)=>{
//         setimage(e.target.files[0]);
//     }
//     const changehandler=(e)=>{
//         setproductDetails({...productDetails,[e.target.name]:e.target.value})
//     }

//     const Add_Product= async ()=>{
//         console.log(productDetails);
//     }
//   return (
//     <div className='addproduct'>
//       <div className="addproduct-itemfields">
//         <p>Product Title</p>
//         <input value={productDetails.name} onChange={changehandler} type="text" className="text" name='name' placeholder='Type Here'/>
//       </div>
//       <div className="addproduct-price">
//       <div className="addproduct-itemfields">
//         <p>Price</p>
//         <input value={productDetails.old_price} onChange={changehandler}type="text" className="text" name='old_price' placeholder='Type Here'/>
//       </div>
//       <div className="addproduct-itemfields">
//         <p>Offer Price</p>
//         <input value={productDetails.new_price} onChange={changehandler}  type="text" className="text" name='new_price' placeholder='Type Here'/>
//       </div>
//       </div>
//       <div className="addproduct-itemfields">
//         <p>Product Category</p>
//         <select value={productDetails.category}  onChange={changehandler}name="category" className='addproduct-selector'>
//             <option value="women">Women</option>
//             <option value="men">Men</option>
//             <option value="kid">Kid</option>
//         </select>
//       </div>
//       <div className="addproduct-itemfields">
//         <label htmlFor='file-input'>
//             <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img'alt=''/>
//         </label>
//         <input onChange={imagehandler} type="file" name="image" id="file-input" hidden/>
//       </div>
//       <button onClick={()=>{Add_Product}} className='addproduct-btn'>Add</button>
    
//     </div>
//   )
// }

// export default AddProduct
