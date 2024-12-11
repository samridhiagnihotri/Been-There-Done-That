import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FoodItem from "../../components/FoodItem";
import FoodItemContainer from "../../components/FoodItemContainer";
import { fetchFoods } from "../../redux/actions/foodActions";
import FoodLinks from "../../components/FoodLinks";
import SearchBar from "../../components/SearchBar";

const ColdBeverage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    food: { categorizedData, loading },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  
  const coldBeverageItems = categorizedData?.cold 
    ? categorizedData.cold.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    dispatch(fetchFoods());
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto min-h-[83vh] p-3">
        <FoodLinks />
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          placeholder="Search cold beverages..."
        />
        <FoodItemContainer>
          {coldBeverageItems.map((item) => (
            <FoodItem key={item._id} item={item} category="cold" />
          ))}
        </FoodItemContainer>
      </div>
    </>
  );
};

export default ColdBeverage;
