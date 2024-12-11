import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FoodItem from "../../components/FoodItem";
import FoodItemContainer from "../../components/FoodItemContainer";
import { fetchFoods } from "../../redux/actions/foodActions";
import FoodLinks from "../../components/FoodLinks";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";

const Desserts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    food: { categorizedData, loading },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  
  const dessertItems = categorizedData?.des 
    ? categorizedData.des.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="max-w-6xl mx-auto min-h-[83vh] p-3">
        <FoodLinks />
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          placeholder="Search desserts..."
        />
        <FoodItemContainer>
          {dessertItems.map((item) => (
            <FoodItem key={item._id} item={item} category="des" />
          ))}
        </FoodItemContainer>
        {dessertItems.length === 0 && (
          <p className="text-center text-gray-400">No desserts available.</p>
        )}
      </div>
    </>
  );
};

export default Desserts;
