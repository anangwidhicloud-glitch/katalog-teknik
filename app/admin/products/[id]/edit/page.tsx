'use client';

import {
  useParams,
} from 'next/navigation';

import {
  useEffect,
  useState,
} from 'react';

import ProductForm from '@/app/admin/components/ProductForm';


export default function EditProductPage() {

  const params = useParams();

  const id =
    params.id as string;


  const [product, setProduct] =
    useState(null);


  const [loading, setLoading] =
    useState(true);



  useEffect(() => {

    async function loadProduct(){

      const response =
        await fetch(
          `/api/products/${id}`,
        );


      const data =
        await response.json();


      setProduct(data);

      setLoading(false);

    }


    loadProduct();

  },[id]);



  if (loading) {

    return (
      <div className="p-8 text-white">
        Memuat produk...
      </div>
    );

  }



  if (!product) {

    return (
      <div className="p-8 text-white">
        Produk tidak ditemukan.
      </div>
    );

  }



  return (

    <ProductForm
      mode="edit"
      initialData={product}
    />

  );

}