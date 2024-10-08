"use client"
import React, {useState, useEffect, useCallback} from 'react'

import FilterArea from '@/components/FilterArea'
import Select from 'react-select'
import ProductCard from '@/components/ProductCard'

import NoResult from '@/components/NoResult'
import api from '@/api/api'

import ProductCardSkeleton from '@/components/skeleton/ProductCardSkeleton'

import { useRouter, usePathname } from 'next/navigation'
import FilterListIcon from '@mui/icons-material/FilterList';

const Category = ({params, searchParams}) => {
  const categoryParam = params.product;
  const searchParam = searchParams;
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRight, setOpenRight] = useState(false);
  const [filterQuery, setFilterQuery] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = useCallback(() => setOpenRight(false), []);
  const fetchProducts = useCallback(async(pr)=>{
    setLoading(true);
    const paramString = convertObjtoString(searchParam);
    const response = await api.get(`products/${categoryParam}${'?'+paramString}`);
    setProducts(response.data);
    setTimeout(()=>{
      setLoading(false);
    },500)
  },[categoryParam, searchParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts])

  const options = [
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' },
    { value: 'l-h', label: 'Price low to high' },
    { value: 'h-l', label: 'Price high to low' }
  ]
  
  const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = 'transparent';
      return {
        ...styles,
        backgroundColor: isDisabled ? 'red' : 'grey',
        color: '#FFF',
        cursor: isDisabled ? 'not-allowed' : 'default',
      };
    },
  };

  const convertObjtoString = (mainObj)=>{
    let paramString = '';
    if(Object.entries(mainObj).length != 0){
      for (const key in mainObj) {
        if (mainObj.hasOwnProperty(key)) {
          paramString += `${key}=${mainObj[key]}&`;
        }
      }
    }
    return paramString;
  }

  const handleFilter = (e) =>{
    // console.log("filters", filterQuery, e.target.value, e.target.name);
    if(e){
      const vl = e.target.value;
      const name = e.target.name;
      const newObj = {[name]: vl};
      const mainObj = {...searchParam, ...newObj}
      router.push(`${pathname}?${convertObjtoString(mainObj)}`);
    }else{
      router.push(`${pathname}?`);
    }
  }

  const handleClearAll = (resetForm) =>{
    router.push(`${pathname}?${''}`);
    // resetForm();
  }

  const handleSelect = (selectedvalue) => {
    const newObj = {sortbyname: selectedvalue.value};
    const mainObj = {...searchParam, ...newObj}
    router.push(`${pathname}?${convertObjtoString(mainObj)}`);
  }

  return (
    <main className='le_archive-page py-5'>
      <div className="relative grid grid-cols-1 lg:grid-cols-5 ">
          {
            categoryParam != 'all'&&
            <div className="relative pl-5">
              <FilterArea handleFilter={handleFilter} categoryParam={categoryParam} handleClearAll={handleClearAll} filterSearchParam={searchParam} openDrawerRight={openDrawerRight} closeDrawerRight={closeDrawerRight} openRight={openRight} />
            </div>
          }
        <div className={`relative ${categoryParam != 'all' ? 'lg:col-span-4':'lg:col-span-5'} px-5`}>
          <div className="archive-pr-wrapper">
            <div className="flex items-center w-full justify-between">
              <h3 className='searched-text mb-0' >{categoryParam && categoryParam.split('-').join(' ')}</h3>
              <div>
                <button className="filter-btn sm:hidden" onClick={openDrawerRight}>
                  <FilterListIcon />
                  <span>Filters</span>
                </button>
                <div className='hidden sm:block'>
                <Select options={options} onChange={handleSelect} styles={colourStyles} />
                </div>
              </div>
            </div>
            <div className="flt-ot-bar flex items-center justify-between flex-wrap gap-5">
              <div className="flex items-center gap-3 flex-wrap">
                
                
              </div>
              {/* <div className="flex items-center gap-3 flex-wrap">
                <Select options={options} styles={colourStyles} />
              </div> */}
            </div>
              {
                loading ?
                <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-5 mt-5">
                  {
                    [...Array(8)].map((item, index)=>(
                      <ProductCardSkeleton key={index} />
                    ))
                  }
                </div>:
                products.length?
                <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-5 mt-5">
                  {
                     products.map((item,index)=>{
                      return(
                        <div className="relative" key={index}>
                          <ProductCard data={item} />
                        </div>
                      )
                    })
                  }
                </div>:<div className='pt-5'><NoResult message={searchParam.search ? `No result found for keyword "${searchParam.search}"`:'No results found try diffrent filters'} /></div>
                
              }
          </div>
        </div>
      </div>
    </main>
  )
}

export default Category