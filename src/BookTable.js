import React from 'react';

const BookTable = ({ books, onHome }) => {
    return (
        <div className="container">
            <img
                src="/home-logo.png" // Update with the correct path
                alt="Home"
                className="homeLogo"
                onClick={onHome}
            />
            <div className="tableContainer">
                <table className="bookTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Publication Year</th>
                            <th>Price</th>
                            <th>Cover</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={index}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.isbn}</td>
                                <td>{book.publicationYear}</td>
                                <td>{book.price}</td>
                                <td>
                                    <img 
                                        src={book.coverImage} // Adjust if your field name is different
                                        alt={`Cover of ${book.title}`}
                                        onError={(e) => {
                                            e.target.style.display = 'none'; // Hide image if error
                                            e.target.nextElementSibling.style.display = 'block'; // Show error message
                                        }}
                                    />
                                    <p className="imageErrorMessage" style={{ display: 'none' }}>
                                        Image cannot be loaded
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookTable;
