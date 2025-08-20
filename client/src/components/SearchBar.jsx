import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  InputLabel,
  ButtonGroup,
  FormControl,
} from "@mui/material";

function SearchBar({ handelSearchClick }) {

  const [searchData, setSearchData] = useState({
    category: "",
    text: "",
  });

  //if search category or text field change by user
  const handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setSearchData((prevData) => {
      return {
        ...prevData,
        [fieldName]: fieldValue,
      };
    });

    console.log("Changed field name:", fieldName, ", New value:", fieldValue);
  };

   // Triggered when the search button is clicked
  // Validates the inputs and sends the search data back to the parent component
  const handleSearch = () => {
    if (!searchData.category || !searchData.text) {
      alert("Please fill in both - Search Category and Search Text");
      return;
    }
    console.log("[handleSearch] Ready to search with:", searchData);
    if (
      searchData.category === "technologies" ||
      searchData.category === "fullName"
    ) {
      console.log("category = ", searchData.category);
      if (!isNaN(searchData.text)) {
        alert("This category accepts text only. Please remove any numbers");
        return;
      }
    } else if (searchData.category === "yearsOfExperience") {
      if (isNaN(searchData.text)) {
        alert("Please enter a number for years of experience");
        return;
      }
    }
    handelSearchClick(searchData);
  };

   // Triggered when the reset button is clicked
  // Clears the search fields and resets the mentor list 
  const handleReset = () => {
    const resetData = { category: "", text: "" };
    setSearchData(resetData);
    handelSearchClick(resetData);
  };

  

  return (
    <Box>
      <FormControl sx={{ width: 230 }} variant="outlined">
        <InputLabel id="select-label">Select Search Category</InputLabel>
        <Select
          labelId="select-label"
          label="Select Search Category"
          name="category"
          value={searchData.category}
          onChange={handleChange}
        >
          <MenuItem value="" disabled>
            Search By
          </MenuItem>
          <MenuItem value="fullName">Name</MenuItem>
          <MenuItem value="technologies">Technology</MenuItem>
          <MenuItem value="yearsOfExperience">Years of experience</MenuItem>
        </Select>
      </FormControl>

      <TextField
        className="search"
        variant="outlined"
        placeholder="Search..."
        sx={{ width: 600 }}
        name="text"
        value={searchData.text}
        onChange={handleChange}
      />

      <ButtonGroup>
        <Button
          sx={{ backgroundColor: "white", width: 100, height: 55 }}
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          sx={{ backgroundColor: "white", width: 120, height: 55 }}
          onClick={handleReset}
        >
          Reset All Mentors
        </Button>
      </ButtonGroup>

    </Box>
  );
}

export default SearchBar;
