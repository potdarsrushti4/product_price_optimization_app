import React, { useState } from 'react';
import './App.css'; // You can add CSS styling here later
import logo from './assets/logo.webp';

// Helper for professional Indian Rupee formatting
const priceFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
});

function App() {
    // 1. STATE: Store input values and results/errors
    const [price, setPrice] = useState(100.0);
    const [discount, setDiscount] = useState(0.15);
    const [rating, setRating] = useState(4.5);
    const [count, setCount] = useState(1200);

    const [optimizedPrice, setOptimizedPrice] = useState('₹--.--');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. EVENT HANDLER: This function now handles the button click
    const getPrediction = async () => {
        setLoading(true);
        setOptimizedPrice('...Calculating...');
        setErrorMessage('');

        try {
            // Validate input
            if (isNaN(price) || isNaN(discount) || isNaN(rating) || isNaN(count)) {
                throw new Error("Please ensure all input fields are valid numbers.");
            }

            // Construct the features array in the order expected by predict.py
            const features = [
                parseFloat(price),
                parseFloat(discount),
                parseFloat(rating),
                parseInt(count)
            ];

            // 3. API Call (same as old logic, but using modern async/await)
            const response = await fetch('https://product-price-optimization-app1.onrender.com/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ features: features })
            });

            const data = await response.json();

            // 4. Handle Server Response
            if (!response.ok || data.error) {
                throw new Error(data.details || data.error || 'Unknown server error.');
            }

            // 5. Update STATE on Success (React automatically updates the UI)
            const newPrice = data.optimized_price;
            if (typeof newPrice === 'number') {
                setOptimizedPrice(priceFormatter.format(newPrice));
            } else {
                throw new Error('Invalid output format from server.');
            }

        } catch (error) {
            // Update STATE on Failure
            setErrorMessage(`Prediction Failed: ${error.message}`);
            setOptimizedPrice('₹--.--');
            console.error('Prediction failed:', error);

        } finally {
            setLoading(false);
        }
    };

    // 3. JSX: The UI Structure (using inline CSS for simplicity, can be moved to App.css)
    return (
        <div style={styles.body}>
            <div style={styles.container}>
                {/* Logo */}
                <div style={styles.logoContainer}>
                    <img src={logo} alt="Vita Logo" style={styles.logo} />
                </div>

                <h1 style={styles.h1}>Price Optimization AI 🤖</h1>

                {/* Input for Price */}
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="price">Actual Product Price:</label>
                    <input
                        type="number" id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)} // Update state on change
                        style={styles.input}
                        step="0.01"
                    />
                </div>

                {/* Input for Discount */}
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="discount">Discount Percentage:</label>
                    <input
                        type="number" id="discount"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        style={styles.input}
                        step="0.01"
                    />
                </div>

                {/* Input for Rating */}
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="rating">Current Rating (0-5):</label>
                    <input
                        type="number" id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={styles.input}
                        step="0.1"
                    />
                </div>

                {/* Input for Count */}
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="count">Total Rating Count:</label>
                    <input
                        type="number" id="count"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        style={styles.input}
                    />
                </div>

                {/* Button */}
                <button
                    onClick={getPrediction}
                    disabled={loading} // Disable button while loading
                    style={loading ? styles.buttonLoading : styles.button}
                >
                    {loading ? 'CALCULATING...' : 'GET OPTIMIZED PRICE'}
                </button>

                {/* Result Display */}
                <div style={styles.resultBox}>
                    <div style={styles.resultLabel}>Recommended Optimized Price:</div>
                    <span style={styles.resultValue}>{optimizedPrice}</span>
                </div>

                {/* Error Display */}
                {errorMessage && (
                    <p style={styles.error}>{errorMessage}</p>
                )}
            </div>
        </div>
    );
}

export default App;

// 4. INLINE CSS (Move to App.css later for cleaner code)
const styles = {
    body: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f4f7f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        margin: 0,
        color: '#333',
    },
    container: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '450px',
    },
    h1: {
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '1.8em',
    },
    inputGroup: {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontWeight: 600,
        marginBottom: '8px',
        color: '#555',
        fontSize: '0.95em',
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '1em',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1.05em',
        fontWeight: 700,
        cursor: 'pointer',
    },
    buttonLoading: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#777',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1.05em',
        fontWeight: 700,
    },
    resultBox: {
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#ecf0f1',
        borderRadius: '6px',
        textAlign: 'center',
        borderLeft: '5px solid #3498db',
    },
    resultLabel: {
        fontSize: '1.1em',
        fontWeight: 600,
        color: '#34495e',
        marginBottom: '5px',
    },
    resultValue: {
        fontSize: '2em',
        fontWeight: 800,
        color: '#e74c3c',
    },
    error: {
        color: '#c0392b',
        fontWeight: 600,
        marginTop: '15px',
        textAlign: 'center',
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    logo: {
        width: '120px', // adjust as needed
        height: 'auto',
    }
};