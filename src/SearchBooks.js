import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import './App.css'; // Import your CSS file

const SearchBooks = ({ goBack }) => {
  const [searchFields, setSearchFields] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
    price: ""
  });
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchFields({ ...searchFields, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const { title, author, isbn, publicationYear, price } = searchFields;

    // Check if all fields are empty
    if (!title && !author && !isbn && !publicationYear && !price) {
      setError("Please enter at least one search criterion.");
      return;
    }

    try {
      const booksRef = collection(db, "books");
      const querySnapshot = await getDocs(booksRef);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const matchesQuery = (book, query) => {
        return Object.keys(query).every(key => 
          !query[key] || book[key].toString().toLowerCase().includes(query[key].toLowerCase())
        );
      };

      const filteredResults = results.filter(book => {
        return matchesQuery(book, {
          title,
          author,
          isbn,
          publicationYear,
          price
        });
      });

      if (filteredResults.length === 0) {
        setError("No books found matching the search criteria.");
      } else {
        setError("");
        const resultsWindow = window.open("", "_blank");
        resultsWindow.document.write("<html><head><title>Search Results</title></head><body>");
        resultsWindow.document.write("<h1>Search Results</h1>");
        filteredResults.forEach(result => {
          resultsWindow.document.write(`<div style="margin-bottom: 20px; margin-top: 20px;">
            <div><strong>Title:</strong> ${result.title}</div>
            <div><strong>Author:</strong> ${result.author}</div>
            <div><strong>ISBN:</strong> ${result.isbn}</div>
            <div><strong>Publication Year:</strong> ${result.publicationYear}</div>
            <div><strong>Price:</strong> ${result.price}</div>
            <div><img src="${result.coverImage}" alt="Cover Image" style="width: 150px; height: auto; margin-top: 10px;" onError="this.src='placeholder-image-url';" /></div>
          </div>`);
        });
        resultsWindow.document.write("</body></html>");
        resultsWindow.document.close();
      }

      setSearchResults(filteredResults);
    } catch (e) {
      setError("Error searching for books.");
      console.error("Error searching documents: ", e);
    }
  };

  const handleClear = () => {
    setSearchResults([]);
    setSearchFields({
      title: "",
      author: "",
      isbn: "",
      publicationYear: "",
      price: ""
    });
  };

  return (
    <div className="container">
      <div className="formContainer">
        <img src="/home-logo.png" alt="Home" className="homeLogo" onClick={goBack} />
        <form onSubmit={handleSearch} className="form">
          <input className="inputField" type="text" name="title" value={searchFields.title} onChange={handleChange} placeholder="Title" />
          <input className="inputField" type="text" name="author" value={searchFields.author} onChange={handleChange} placeholder="Author" />
          <input className="inputField" type="text" name="isbn" value={searchFields.isbn} onChange={handleChange} placeholder="ISBN" />
          <input className="inputField" type="text" name="publicationYear" value={searchFields.publicationYear} onChange={handleChange} placeholder="Publication Year" />
          <input className="inputField" type="text" name="price" value={searchFields.price} onChange={handleChange} placeholder="Price" />
          <button className="button" type="submit">Search</button>
        </form>
        {error && <p className="message error">{error}</p>}
        {searchResults.length > 0 && (
          <div>
            <button className="button" onClick={handleClear} style={{ marginTop: '20px' }}>Clear</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBooks;
