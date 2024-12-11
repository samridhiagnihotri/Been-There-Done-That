import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FoodItem from "../../components/FoodItem";
import FoodItemContainer from "../../components/FoodItemContainer";
import { fetchFoods } from "../../redux/actions/foodActions";
import FoodLinks from "../../components/FoodLinks";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";

const HotBeverage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    food: { categorizedData, loading },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  
  const hotBeverageItems = categorizedData?.hot 
    ? categorizedData.hot.filter(item =>
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
          placeholder="Search hot beverages..."
        />
        <FoodItemContainer>
          {hotBeverageItems.map((item) => (
            <FoodItem key={item._id} item={item} category="hot" />
          ))}
        </FoodItemContainer>
        {hotBeverageItems.length === 0 && (
          <p className="text-center text-gray-400">No hot beverages available.</p>
        )}
      </div>
    </>
  );
};

export default HotBeverage;
