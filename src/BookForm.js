// src/BookForm.js
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import './App.css'; // Import your CSS file

const BookForm = ({ goBack }) => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    isbn: "",
    coverImage: "",
    publicationYear: "",
    price: ""
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "books"), book);
      setBook({
        title: "",
        author: "",
        isbn: "",
        coverImage: "",
        publicationYear: "",
        price: ""
      });
      setSuccessMessage("Book added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <img 
          src="/home-logo.png" 
          alt="Home" 
          className="homeLogo" 
          onClick={goBack} 
          style={{ marginBottom: '20px' }}
        />
        <form onSubmit={handleSubmit} className="form">
          <input className="inputField" type="text" name="title" value={book.title} onChange={handleChange} placeholder="Title" required />
          <input className="inputField" type="text" name="author" value={book.author} onChange={handleChange} placeholder="Author" required />
          <input className="inputField" type="text" name="isbn" value={book.isbn} onChange={handleChange} placeholder="ISBN" required />
          <input className="inputField" type="text" name="coverImage" value={book.coverImage} onChange={handleChange} placeholder="Cover Image URL" />
          <input className="inputField" type="text" name="publicationYear" value={book.publicationYear} onChange={handleChange} placeholder="Publication Year" />
          <input className="inputField" type="text" name="price" value={book.price} onChange={handleChange} placeholder="Price" />
          <button className="button" type="submit">Add Book</button>
        </form>
        {successMessage && <p className="message success">{successMessage}</p>}
      </div>
    </div>
  );
};

export default BookForm;
