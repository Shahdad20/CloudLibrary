import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure this path is correct
import BookForm from './BookForm';
import BookList from './BookList';
import SearchBooks from './SearchBooks';
import BookTable from './BookTable';
import './App.css';

const App = () => {
    const [view, setView] = useState("home");
    const [isGuest, setIsGuest] = useState(false);
    const [books, setBooks] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const loginButtonRef = useRef(null);

    const authenticateUser = () => {
        const validUsername = process.env.REACT_APP_VALID_USERNAME;
        const validPassword = process.env.REACT_APP_VALID_PASSWORD;

        if (username === validUsername && password === validPassword) {
            setIsAuthenticated(true);
            setIsGuest(false);
            setView("main");
        } else {
            alert("Invalid username or password");
        }
    };

    const handleLogin = () => {
        authenticateUser();
    };

    const handleGuest = () => {
        setIsGuest(true);
        setIsAuthenticated(true);
        setView("main");
    };

    const handleBack = () => {
        setView("home");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (loginButtonRef.current) {
                loginButtonRef.current.click();
            }
        }
    };

    useEffect(() => {
        if (view === "list") {
            const fetchBooks = async () => {
                const booksCollection = await getDocs(collection(db, "books"));
                setBooks(booksCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            };

            fetchBooks();
        }
    }, [view]);

    const renderContent = () => {
        switch (view) {
            case "home":
                return (
                    <div className="homeContainer">
                        <h1 className="welcomeHeading">CloudLibrary, a New Approach to Organize a Library</h1>
                        <button className="homeButton" onClick={() => setView("login")}>Sign In</button>
                        <button className="homeButton" onClick={handleGuest}>Continue as Guest</button>
                    </div>
                );

            case "login":
                return (
                    <div className="appContainer">
                        <div className="formContainer">
                            <div className="form">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="inputField"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="off"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="inputField"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <button
                                    className="button"
                                    onClick={handleLogin}
                                    ref={loginButtonRef}
                                >
                                    Login
                                </button>
                                <button className="button backButton" onClick={handleBack}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case "main":
                return (
                    <div className="appContainer">
                        {!isGuest && <button className="mainButton" onClick={() => setView("add")}>Add Book</button>}
                        {!isGuest && <button className="mainButton" onClick={() => setView("delete")}>Delete Book</button>}
                        <button className="mainButton" onClick={() => setView("search")}>Search Books</button>
                        <button className="mainButton" onClick={() => setView("list")}>List All Books</button>
                        <button className="mainButton" onClick={handleBack}>Back</button>
                    </div>
                );

            case "add":
                return <BookForm goBack={() => setView("main")} />;

            case "delete":
                return <BookList goBack={() => setView("main")} />;

            case "search":
                return <SearchBooks goBack={() => setView("main")} />;

            case "list":
                return <BookTable books={books} onHome={() => setView("main")} />;

            default:
                return null;
        }
    };

    return (
        <div className={`appContainer ${view === "home" ? "homePage" : ""}`}>
            {renderContent()}
        </div>
    );
};

export default App;
