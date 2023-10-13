import React, { useState, useEffect } from "react";
import DependentSelect from "../../components/FormField/DependentSelect";
import testData from "../../data/testData.json";

const TestPage = () => {
  const [initialState, setInitialState] = useState({
    source: testData.source,
    country: [],
    state: [],
    city: [],
    neighborhoods: [],
    sourceMap: {
      country: 0,
      state: 1,
      city: 2,
      neighborhoods: 3
    }
  });

  useEffect(() => {
    const { country } = initialState.source;
    setInitialState((prevInitialState) => ({
      ...prevInitialState,
      country
    }));
  }, [initialState.source]);
  console.log("initialState source:", initialState.source);
  
  const clearDropdowns = (next) => {
    const { sourceMap } = initialState;
    const nextkey = sourceMap[next];
  
    const newState = Object.entries(sourceMap)
      .filter(([_key, value]) => value > nextkey)
      .reduce((newState, [key]) => {
        return {
          ...newState,
          [key]: [],
        };
      }, initialState);
  
    setInitialState({
      ...initialState,
      ...newState,
    });
  };
  

  const handleDropdownChange = ({ value, current, next }) => {
    console.log("Selected value:", value);
  console.log("Current dropdown:", current);
  console.log("Next dropdown:", next);

    const { source } = initialState;
    const data = source[next]; // Get the data for the next dropdown
    console.log("Data for next dropdown:", data);
  
    if (data) {
      // Filter the data based on the selected value from the current dropdown
      const filteredData = data.filter((item) => item[current] === Number(value));
      console.log("Filtered data for next dropdown:", filteredData);
  
      // Update the state for the next dropdown
      setInitialState((prevState) => ({
        ...prevState,
        [next]: filteredData,
      }));
    }
  
    // Clear values for subsequent dependent dropdowns
    clearDropdowns(next);
  };
  

  const handleSelectChange = (params) => (ev) => {
    const target = ev.currentTarget;
    const { value } = target;
    handleDropdownChange({ value, ...params });
  };
  

  const { country, state, city, neighborhoods } = initialState;
  console.log("Updated State:", initialState);
  

  
  return (
    <div>
      <h1>Dependent dropdown</h1>
      <section>
        <DependentSelect
          data={country}
          action={(selectedValue) => handleSelectChange({ current: "country", next: "state", value: selectedValue })}
          current="country"
          next="state"
        />
        <DependentSelect
          data={state}
          action={(selectedValue) => handleSelectChange({ current: "state", next: "city", value: selectedValue })}
          current="state"
          next="city"
        />
        <DependentSelect
          data={city}
          action={(selectedValue) => handleSelectChange({ current: "city", next: "neighborhoods", value: selectedValue })}
          current="city"
          next="neighborhoods"
        />
        <DependentSelect
          data={neighborhoods}
        />
      </section>
    </div>
  );
};

export default TestPage;
