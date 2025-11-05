import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { Api } from "../commonapi/api";


const CategoryPage = () => {
//   const { categoryName } = useParams();
//   const [products,setProduct]=useState([])
  
//   useEffect(()=>{
//     Api.get('/products').then((res)=>setProduct(res.data)).catch((err)=>console.log("Pruduc fetchig error in Category Page",err)  )
//   })

//   const filteredProducts = products.filter(
//     (product) => product.category.toLowerCase() === categoryName
//   );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold capitalize mb-4">{categoryName} Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white shadow p-4 rounded">
            <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded" />
            <h3 className="mt-2 font-semibold">{product.name}</h3>
            <p>₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
