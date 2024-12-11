import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FoodItem from "../../components/FoodItem";
import FoodItemContainer from "../../components/FoodItemContainer";
import { fetchFoods } from "../../redux/actions/foodActions";
import FoodLinks from "../../components/FoodLinks";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";

const Sides = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    food: { categorizedData, loading },
  } = useSelector((state) => {
    console.log('Current Redux State:', state);
    console.log('Categorized Data:', state.food.categorizedData);
    return state;
  });
  const dispatch = useDispatch();
  
  console.log('Side Items:', categorizedData?.sides);

  const sideItems = categorizedData?.sides 
    ? categorizedData.sides.filter(item =>
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
          placeholder="Search side dishes..."
        />
        <FoodItemContainer>
          {sideItems.map((item) => (
            <FoodItem key={item._id} item={item} category="sides" />
          ))}
        </FoodItemContainer>
        {sideItems.length === 0 && (
          <p className="text-center text-gray-400">No side dishes available.</p>
        )}
      </div>
    </>
  );
};

export default Sides;
