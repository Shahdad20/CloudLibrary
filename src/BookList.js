import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import './App.css'; // Import your CSS file

const BookList = ({ goBack }) => {
  const [books, setBooks] = useState([]);
  const [deleteFields, setDeleteFields] = useState({
    title: "",
    author: "",
    isbn: "",
    coverImage: "",
    publicationYear: "",
    price: ""
  });
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = await getDocs(collection(db, "books"));
        setBooks(booksCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeleteFields({ ...deleteFields, [name]: value });
  };

  const handleDelete = async () => {
    const { title, author, isbn, coverImage, publicationYear, price } = deleteFields;

    try {
      const bookToDelete = books.find(book => 
        (!title || book.title === title) &&
        (!author || book.author === author) &&
        (!isbn || book.isbn === isbn) &&
        (!coverImage || book.coverImage === coverImage) &&
        (!publicationYear || book.publicationYear === publicationYear) &&
        (!price || book.price === price)
      );

      if (bookToDelete) {
        await deleteDoc(doc(db, "books", bookToDelete.id));
        setBooks(prevBooks => prevBooks.filter(book => book.id !== bookToDelete.id));
        setDeleteSuccess("Book deleted successfully!");
        setDeleteFields({
          title: "",
          author: "",
          isbn: "",
          coverImage: "",
          publicationYear: "",
          price: ""
        });
        setTimeout(() => setDeleteSuccess(""), 3000); // Clear success message after 3 seconds
      } else {
        setError("No matching book found.");
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <img src="/home-logo.png" alt="Home" className="homeLogo" onClick={goBack} />
        <div className="form">
          <input className="inputField" type="text" name="title" value={deleteFields.title} onChange={handleInputChange} placeholder="Title" />
          <input className="inputField" type="text" name="author" value={deleteFields.author} onChange={handleInputChange} placeholder="Author" />
          <input className="inputField" type="text" name="isbn" value={deleteFields.isbn} onChange={handleInputChange} placeholder="ISBN" />
          <input className="inputField" type="text" name="coverImage" value={deleteFields.coverImage} onChange={handleInputChange} placeholder="Cover Image URL" />
          <input className="inputField" type="text" name="publicationYear" value={deleteFields.publicationYear} onChange={handleInputChange} placeholder="Publication Year" />
          <input className="inputField" type="text" name="price" value={deleteFields.price} onChange={handleInputChange} placeholder="Price" />
          <button className="button" onClick={handleDelete}>Delete Book</button>
        </div>
        {deleteSuccess && <p className="message success">{deleteSuccess}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </div>
  );
};

export default BookList;
