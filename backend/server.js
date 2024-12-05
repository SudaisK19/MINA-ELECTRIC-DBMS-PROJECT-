const mysql = require('mysql2/promise'); // Promise-based MySQL library
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Import Nodemailer

const app = express();
const PORT = 3001;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
    },
  })
);

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Jealous278',
  database: 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
console.log('MySQL connection pool created...');

// Register Route
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, address, phone } = req.body;

  if (!firstName || !lastName || !email || !password || !address || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password.length < 7) {
    return res.status(400).json({ message: 'Password must be at least 7 characters long.' });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM Customer WHERE Email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    await db.query(
      `
      INSERT INTO Customer (FirstName, LastName, Email, Password, Address, Phone) 
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [firstName, lastName, email, password, address, phone]
    );

    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for admin credentials first
  if ((email === 'admin1@gmail.com' && password === 'admin111') || (email === 'admin2@gmail.com' && password === 'admin222')) {
    // Admin credentials matched
    req.session.user = { email, role: 'admin' }; // Store user role as 'admin'
    return res.status(200).json({ message: 'Admin login successful', redirect: '/admin' });
  }

  try {
    // Check for customer credentials
    const [results] = await db.query(
      'SELECT * FROM Customer WHERE Email = ? AND Password = ?',
      [email, password]
    );

    if (results.length > 0) {
      // Customer credentials matched
      req.session.user = {
        id: results[0].CustomerID,
        email: results[0].Email,
        role: 'customer', // Store user role as 'customer'
      };
      return res.status(200).json({ message: 'Customer login successful', redirect: '/' });
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Fetch user profile
app.get('/api/profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [results] = await db.query('SELECT * FROM Customer WHERE CustomerID = ?', [req.session.user.id]);

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { firstName, lastName, phone, address, password } = req.body;

  try {
    const [result] = await db.query(
      `
      UPDATE Customer 
      SET FirstName = ?, LastName = ?, Phone = ?, Address = ?, Password = ?
      WHERE CustomerID = ?
    `,
      [firstName, lastName, phone, address, password, req.session.user.id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout Route
app.post('/api/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});



app.get('/api/products/category/:catId', async (req, res) => {
  const { catId } = req.params; // Extract category ID from the URL

  try {
    // Modify the query to include ProductID
    const [products] = await db.query(
      'SELECT ProductID, Title, Price, Rating, ImageURL, StockStatus FROM product WHERE CategoryID = ?',
      [catId]
    );

    // Log the query result to check the format of the returned data
    console.log('Fetched products:', products);

    // Process the products (if necessary, e.g., convert Buffer data to strings)
    const formattedProducts = products.map(product => {
      return {
        ProductID: product.ProductID, // Include ProductID in the response
        Title: product.Title ? product.Title.toString() : '',
        Price: product.Price,
        Rating: product.Rating,
        ImageURL: product.ImageURL ? product.ImageURL.toString() : '',
        StockStatus: product.StockStatus ? product.StockStatus.toString() : 'Unknown',
      };
    });

    // Return the formatted products as a JSON response
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server Error');
  }
});







// Modified Product by ID Endpoint with Aliased Fields
// products.js (API Endpoint)
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        ProductID,
        Title,
        Model,
        Description,
        Stock,
        CategoryID,
        Manufacturer,
        Features,
        Price,
        ImageURL,
        Rating,
        StockStatus,
        Dimensions
      FROM Product
      WHERE ProductID = ? 
    `;
    const [results] = await db.query(query, [id]);
    if (results.length > 0) {
      res.json(results[0]); // Return the product with the specified ID
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error fetching Product by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Modified Categories Endpoint with Aliased Fields
// categories.js (API Endpoint)
app.get('/api/categories', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        CategoryID,
        Title
      FROM Category
    `);
    res.json(results); // Return category ID and title
  } catch (err) {
    console.error('Error fetching Categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/reviews/:productId', async (req, res) => {
  const { productId } = req.params;

  if (!productId || isNaN(Number(productId))) {
    return res.status(400).json({ message: 'Invalid or missing product ID.' });
  }

  try {
    const query = `
      SELECT 
        ReviewID,
        CustomerID,
        ProductID,
        Rating,
        ReviewText,
        ReviewDate
      FROM Review
      WHERE ProductID = ?
      ORDER BY ReviewDate DESC
    `;
    const [reviews] = await db.query(query, [Number(productId)]);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

const authenticate = (req, res, next) => {
  if (req.session && req.session.user) {
    next(); // User is authenticated, proceed to the next middleware or route
  } else {
    res.status(401).json({ message: 'Unauthorized: Please log in to perform this action.' });
  }
};
app.post('/api/reviews', authenticate, async (req, res) => {
  const { ProductID, Rating, ReviewText } = req.body;
  const CustomerID = req.session.user.id;

  if (!CustomerID || !ProductID || !Rating || isNaN(Number(Rating))) {
    return res.status(400).json({ message: 'Invalid or missing fields.' });
  }

  try {
    const query = `
      INSERT INTO Review (CustomerID, ProductID, Rating, ReviewText, ReviewDate)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const params = [CustomerID, ProductID, Number(Rating), ReviewText || null];
    const [result] = await db.query(query, params);

    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'Review added successfully!' });
    } else {
      res.status(400).json({ message: 'Failed to add review.' });
    }
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}); // masla here 
// Fetch Cart Items for a Customer
app.get('/api/cart', authenticate, async (req, res) => {
  const { id: customerId } = req.session.user;

  if (!customerId) {
    return res.status(400).json({ message: 'Customer ID is required.' });
  }

  try {
    const query = `
      SELECT 
        ci.CartItemID, ci.ProductID, ci.Quantity, ci.Price, 
        p.Title, p.ImageURL ,p.Dimensions,p.Rating,p.Model
      FROM CartItem ci
      INNER JOIN Cart c ON ci.CartID = c.CartID
      INNER JOIN Product p ON ci.ProductID = p.ProductID
      WHERE c.CustomerID = ?
    `;
    const [results] = await db.query(query, [customerId]);

    res.json(results || []); // Return empty array if no results
  } catch (error) {
    console.error('Error fetching cart items:', error.stack);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Add Item to Cart
app.post('/api/cart', authenticate, async (req, res) => {
  const { id: customerId } = req.session.user; // Customer ID from session
  const { productId, quantity = 1 } = req.body; // Product ID and Quantity (default: 1)
  
  if (!productId) {
  return res.status(400).json({ message: 'Product ID is required.' });
  }
  
  try {
  // Ensure the customer has a cart
  const [cart] = await db.query(
  'SELECT CartID FROM Cart WHERE CustomerID = ?',
  [customerId]
  );
  
  let cartId;
  if (cart.length > 0) {
  cartId = cart[0].CartID;
  } else {
  const [newCart] = await db.query(
  'INSERT INTO Cart (CustomerID, TotalAmount) VALUES (?, 0)',
  [customerId]
  );
  cartId = newCart.insertId;
  }
  
  // Check if the item already exists in the cart
  const [existingItem] = await db.query(
  'SELECT Quantity FROM CartItem WHERE CartID = ? AND ProductID = ?',
  [cartId, productId]
  );
  
  if (existingItem.length > 0) {
  // If exists, increment quantity and update price
  await db.query(
  `UPDATE CartItem
  SET Quantity = Quantity + ?,
  Price = Price + (SELECT Price FROM Product WHERE ProductID = ?) * ?
  WHERE CartID = ? AND ProductID = ?`,
  [quantity, productId, quantity, cartId, productId]
  );
  } else {
  // Otherwise, insert a new item
  const [product] = await db.query(
  'SELECT Price FROM Product WHERE ProductID = ?',
  [productId]
  );
  
  if (product.length === 0) {
  return res.status(404).json({ message: 'Product not found.' });
  }
  
  await db.query(
  'INSERT INTO CartItem (CartID, ProductID, Quantity, Price) VALUES (?, ?, ?, ?)',
  [cartId, productId, quantity, product[0].Price * quantity]
  );
  }
  
  // Update the total amount in the Cart table
  await db.query(
  `UPDATE Cart
  SET TotalAmount = (SELECT COALESCE(SUM(Price), 0) FROM CartItem WHERE CartID = ?)
  WHERE CartID = ?`,
  [cartId, cartId]
  );
  
  res.status(200).json({ message: 'Item added to cart successfully!' });
  } catch (error) {
  console.error('Error adding item to cart:', error);
  res.status(500).json({ message: 'Internal server error.' });
  }
  });
  
  
  
// Update Item in Cart
app.put('/api/cart', authenticate, async (req, res) => {
  const { id: customerId } = req.session.user; // Authenticated user's ID
  const { productId, quantity } = req.body; // Product and new quantity from request body
  
  if (!productId || quantity === undefined) {
  return res.status(400).json({ message: 'Product ID and quantity are required.' });
  }
  
  try {
  // Fetch the cart ID for the user
  const [cart] = await db.query(
  'SELECT CartID FROM Cart WHERE CustomerID = ?',
  [customerId]
  );
  
  if (cart.length === 0) {
  return res.status(404).json({ message: 'Cart not found for the user.' });
  }
  
  const cartId = cart[0].CartID;
  
  // Check if the product exists in the cart
  const [existingItem] = await db.query(
  'SELECT Quantity FROM CartItem WHERE CartID = ? AND ProductID = ?',
  [cartId, productId]
  );
  
  if (existingItem.length > 0) {
  // If quantity is greater than 0, update the quantity and price
  if (quantity > 0) {
  await db.query(
  'UPDATE CartItem SET Quantity = ?, Price = (SELECT Price FROM Product WHERE ProductID = ?) * ? WHERE CartID = ? AND ProductID = ?',
  [quantity, productId, quantity, cartId, productId]
  );
  res.status(200).json({ message: 'Cart item updated successfully.' });
  } else {
  // If quantity is 0, delete the item from the cart
  await db.query(
  'DELETE FROM CartItem WHERE CartID = ? AND ProductID = ?',
  [cartId, productId]
  );
  res.status(200).json({ message: 'Cart item removed successfully.' });
  }
  
  // After updating the cart, recalculate and update the total amount
  await db.query(
  `UPDATE Cart
  SET TotalAmount = (SELECT COALESCE(SUM(Price), 0) FROM CartItem WHERE CartID = ?)
  WHERE CartID = ?`,
  [cartId, cartId]
  );
  
  } else {
  res.status(404).json({ message: 'Item not found in cart.' });
  }
  } catch (error) {
  console.error('Error updating cart item:', error);
  res.status(500).json({ message: 'Internal server error.' });
  }
  });


// Remove a specific item from the cart
app.delete('/api/cart/:productId', authenticate, async (req, res) => {
const { id: customerId } = req.session.user;
const { productId } = req.params;

try {
// Fetch the cart ID for the user
const [cart] = await db.query(
'SELECT CartID FROM Cart WHERE CustomerID = ?',
[customerId]
);

if (cart.length === 0) {
return res.status(404).json({ message: 'Cart not found for the user.' });
}

const cartId = cart[0].CartID;

// Delete the item from the cart
const [result] = await db.query(
'DELETE FROM CartItem WHERE CartID = ? AND ProductID = ?',
[cartId, productId]
);

if (result.affectedRows > 0) {
// Recalculate the total amount for the cart
await db.query(
`UPDATE Cart
SET TotalAmount = (SELECT COALESCE(SUM(Price), 0) FROM CartItem WHERE CartID = ?)
WHERE CartID = ?`,
[cartId, cartId]
);
res.status(200).json({ message: 'Item removed from cart successfully.' });
} else {
res.status(404).json({ message: 'Item not found in cart.' });
}
} catch (error) {
console.error('Error removing item from cart:', error);
res.status(500).json({ message: 'Internal server error.' });
}
});

app.get('/api/wishlist', authenticate, async (req, res) => {
  const { id: customerId } = req.session.user;

  if (!customerId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const query = `
      SELECT w.ProductID, p.Title, p.Price, p.ImageURL 
      FROM Wishlist w
      INNER JOIN Product p ON w.ProductID = p.ProductID
      WHERE w.CustomerID = ?
    `;
    const [results] = await db.query(query, [customerId]);
    res.json(results);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post('/api/wishlist', authenticate, async (req, res) => {
  const { id: customerId } = req.session.user;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    const query = `
      INSERT IGNORE INTO Wishlist (CustomerID, ProductID)
      VALUES (?, ?)
    `;
    await db.query(query, [customerId, productId]);

    const fetchUpdatedWishlistQuery = `
      SELECT w.ProductID, p.Title, p.Price, p.ImageURL 
      FROM Wishlist w
      INNER JOIN Product p ON w.ProductID = p.ProductID
      WHERE w.CustomerID = ?
    `;
    const [updatedWishlist] = await db.query(fetchUpdatedWishlistQuery, [customerId]);

    res.status(200).json(updatedWishlist);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


app.delete('/api/wishlist/:productID', authenticate, async (req, res) => {
  const { id: customerId } = req.session.user; // Get customer ID from session
  const { productID } = req.params; // Get product ID from the request params

  if (!customerId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!productID) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    const query = `
      DELETE FROM Wishlist
      WHERE CustomerID = ? AND ProductID = ?
    `;
    const [result] = await db.query(query, [customerId, productID]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Item removed from wishlist successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found in wishlist.' });
    }
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Fetch Combined Order, OrderItem, and Product Details
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params; // Extract orderId from URL parameters

  // Validate the orderId
  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  try {
    // Query to fetch order details, order items, and product details
    const [orderDetails] = await db.query(
      `
      SELECT 
          o.OrderID,
          o.OrderDate,
          o.OrderStatus,
          o.TotalAmount,
          o.ShippingAddress,
          oi.OrderItemID,
          oi.Quantity,
          oi.Price AS ItemPrice,
          p.ProductID,
          p.Title AS ProductTitle,
          p.Model AS ProductModel,
          p.Description AS ProductDescription,
          p.Stock AS ProductStock,
          p.Manufacturer AS ProductManufacturer,
          p.Features AS ProductFeatures,
          p.ImageURL AS ProductImage,
          p.Rating AS ProductRating,
          p.Dimensions AS ProductDimensions
      FROM 
          Orders o
      JOIN 
          OrderItem oi ON o.OrderID = oi.OrderID
      JOIN 
          Product p ON oi.ProductID = p.ProductID
      WHERE 
          o.OrderID = ?
      `,
      [orderId]
    );

    // If no order is found, return 404
    if (orderDetails.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Send the response with combined order, order item, and product details
    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error); // Debug log
    res.status(500).json({ message: 'Internal server error.' });
  }
});





app.post('/api/orders', authenticate, async (req, res) => {
  const { id: customerId, email: customerEmail } = req.session.user; // Get user email for sending confirmation
  const { shippingAddress } = req.body; // Get shipping address from request

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required.' });
  }

  try {
    const connection = await db.getConnection(); // Get a connection from the pool

    try {
      await connection.beginTransaction(); // Start transaction

      // Step 1: Insert into Orders table
      const [orderResult] = await connection.execute(
        `
        INSERT INTO Orders (CustomerID, OrderDate, OrderStatus, TotalAmount, ShippingAddress)
        VALUES (?, NOW(), 'Pending', (SELECT TotalAmount FROM Cart WHERE CustomerID = ?), ?)
        `,
        [customerId, customerId, shippingAddress]
      );

      const orderId = orderResult.insertId; // Get the new Order ID

      // Step 2: Copy items from CartItem to OrderItem
      const [cartItems] = await connection.execute(
        `
        SELECT ProductID, Quantity, Price
        FROM CartItem
        WHERE CartID = (SELECT CartID FROM Cart WHERE CustomerID = ?)
        `,
        [customerId]
      );

      // Insert order items
      await connection.execute(
        `
        INSERT INTO OrderItem (OrderID, ProductID, Quantity, Price)
        SELECT ?, ProductID, Quantity, Price
        FROM CartItem
        WHERE CartID = (SELECT CartID FROM Cart WHERE CustomerID = ?)
        `,
        [orderId, customerId]
      );

      // Step 3: Update Product quantities
      for (const item of cartItems) {
        const { ProductID, Quantity } = item;

        // Decrease stock in Product table
        await connection.execute(
          `
          UPDATE Product
          SET Stock = Stock - ?
          WHERE ProductID = ?
          `,
          [Quantity, ProductID]
        );
      }

      // Step 4: Clear CartItem
      await connection.execute(
        `
        DELETE FROM CartItem
        WHERE CartID = (SELECT CartID FROM Cart WHERE CustomerID = ?)
        `,
        [customerId]
      );

      // Step 5: Reset Cart Total
      await connection.execute(
        `
        UPDATE Cart
        SET TotalAmount = 0
        WHERE CustomerID = ?
        `,
        [customerId]
      );

      // Commit the transaction
      await connection.commit();
      console.log('Transaction committed. Returning Order ID:', orderId); // Debug log
            // content 
            const emailContent = `
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; color: #007bff; }
                  .order-details { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  .order-details th, .order-details td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                  .order-details th { background-color: #f4f4f4; }
                  .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
                  .footer { text-align: center; font-size: 12px; color: #aaa; padding-top: 20px; }
                  h1 { color: #333; }
                  .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>Order Confirmation</h1>
                </div>
                <p><strong>Order ID:</strong> ${orderId}</p>
                
                <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
                <h2>Order Details:</h2>
                <table class="order-details">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cartItems.map(item => `
                      <tr>
                        <td>${item.ProductID}</td> <!-- Replace with actual product name -->
                        <td>${item.Quantity}</td>
                        <td>${item.Price}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <p><strong>Total Amount:</strong> ${cartItems.reduce((total, item) => total + (item.Quantity * item.Price), 0)}</p>
                <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
              
                <div class="footer">
                  <p>Thank you for your purchase! We'll notify you once your order is shipped.</p>
                </div>
              </body>
            </html>
          `;
    

            //
      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
          user: 'sudais.katiya191@gmail.com', // Your email
          pass: 'kbdd zraz qbcl hxkq' // Your email password
        }
      });

      const mailOptions = {
        from: 'sudais.katiya191@gmail.com', // Sender's email
        to: customerEmail, // Recipient's email (customer's email)
        subject: 'Order Confirmation - Order #' + orderId,
        html: emailContent
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      // Send the orderId in the response
      res.status(201).json({ orderId });

    } catch (error) {
      // Rollback the transaction if something goes wrong
      await connection.rollback();
      console.error('Error committing transaction:', error); // Debug log
      res.status(500).json({ message: 'Failed to place order.' });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  } catch (error) {
    console.error('Database connection error:', error); // Debug log
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Fetch Orders for a Specific Customer
app.get('/api/orders/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    // Query to fetch orders for the specific customer
    const [orders] = await db.query(
      'SELECT OrderID, orderStatus, totalAmount, OrderDate FROM Orders WHERE CustomerID = ?',
      [customerId]
    );

    if (orders.length > 0) {
      res.json(orders);
    } else {
      res.status(404).json({ message: 'No orders found for this customer.' });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// API endpoint for search
app.get('/api/search', async (req, res) => {
  const query = req.query.query; // Get search term from query parameter
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // SQL query to search in the Product table
    const sql = `
      SELECT * FROM Product
      WHERE Title LIKE ? OR Model LIKE ? OR Description LIKE ? OR Manufacturer LIKE ? OR Features LIKE ?
    `;
    
    // Prepare the values for LIKE search
    const values = [
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`
    ];

    const [results] = await db.execute(sql, values); // Assuming `db.execute` is your database query method
    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found' });
    }

    return res.json({ data: results });
  } catch (error) {
    console.error('Error during search:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// API Endpoint to filter products
app.get('/api/filter/products', async (req, res) => {
  const { minPrice, maxPrice, sortOrder } = req.query;

  try {
    // Base SQL query with filtering and sorting included
    const sql = `
      SELECT * FROM Product
      WHERE 
        (Price >= ? OR ? IS NULL) 
        AND (Price <= ? OR ? IS NULL)
      ORDER BY Price ${sortOrder === 'highToLow' ? 'DESC' : 'ASC'}
    `;

    // Values for placeholders
    const values = [
      minPrice ? Number(minPrice) : null, // Min price or null if not provided
      minPrice ? Number(minPrice) : null,  // For handling IS NULL check
      maxPrice ? Number(maxPrice) : null, // Max price or null if not provided
      maxPrice ? Number(maxPrice) : null  // For handling IS NULL check
    ];

    console.log('Executing SQL:', sql);
    console.log('Values:', values);

    // Execute the query
    const [results] = await db.execute(sql, values);

    // If no products are found
    if (results.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Return the filtered and sorted products
    res.json(results);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// app.get('/api/products/filter/:catId', (req, res) => {
//   const { minPrice, maxPrice, sort } = req.query;
//   const catId = req.params.catId; // Get the category ID from the URL parameter

//   // Base query to fetch products
//   let query = 'SELECT * FROM product WHERE categoryid = ?';
//   let params = [catId]; // Always apply category filter based on the provided catId

//   // Apply price range filter if minPrice and maxPrice are provided
//   if (minPrice) {
//     query += ' AND price >= ?';
//     params.push(parseFloat(minPrice));
//   }
//   if (maxPrice) {
//     query += ' AND price <= ?';
//     params.push(parseFloat(maxPrice));
//   }

//   // Sorting logic: Default is 'ASC' for price, but switch to 'DESC' if 'highToLow' is requested
//   let order = 'ASC'; // Default is Low to High
//   if (sort === 'highToLow') {
//     order = 'DESC'; // If 'highToLow' is selected, set descending order
//   }

//   query += ` ORDER BY price ${order}`; // Add sorting condition to the query

//   console.log('Executing query:', query);
//   console.log('With parameters:', params);

//   // Execute the query with the provided parameters
//   db.query(query, params, (err, result) => {
//     if (err) {
//       console.error('Error fetching products: ', err);
//       return res.status(500).json({ message: 'Error fetching products' });
//     }
    
//     if (result.length > 0) {
//       return res.json(result); // Return the filtered products as a JSON response
//     } else {
//       return res.status(404).json({ message: 'No products found matching the criteria' });
//     }
//   });
// });


/////////////////////////azkas api/////////////////////////



//// Dashboard Metrics Route
app.get('/api/admin/metrics', async (req, res) => {
  try {
      const totalProductsQuery = 'SELECT COUNT(*) AS totalProducts FROM Product';
      const totalCategoriesQuery = 'SELECT COUNT(*) AS totalCategories FROM Category';
      const totalOrdersQuery = 'SELECT COUNT(*) AS totalOrders FROM Orders';
      const totalCustomersQuery = 'SELECT COUNT(*) AS totalCustomers FROM Customer';

      const [productsResult] = await db.query(totalProductsQuery);
      const [categoriesResult] = await db.query(totalCategoriesQuery);
      const [ordersResult] = await db.query(totalOrdersQuery);
      const [customersResult] = await db.query(totalCustomersQuery);

      res.json({
          totalProducts: productsResult[0].totalProducts,
          totalCategories: categoriesResult[0].totalCategories,
          totalOrders: ordersResult[0].totalOrders,
          totalCustomers: customersResult[0].totalCustomers,
      });
  } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});




// Category Routes
app.get('/api/admin/categories', async (req, res) => {
  try {
    const query = 'SELECT * FROM Category';
    const [results] = await db.query(query); // Using the promise API with await
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new category
app.post('/api/admin/categories', async (req, res) => {
  const { Title } = req.body;
  const query = 'INSERT INTO Category (Title) VALUES (?)';

  try {
    const [results] = await db.query(query, [Title]);
    res.json({ message: 'Category added successfully', categoryID: results.insertId });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update category
app.put('/api/admin/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { Title } = req.body;
  const query = 'UPDATE Category SET Title = ? WHERE CategoryID = ?';

  try {
    const [results] = await db.query(query, [Title, id]);
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete category
app.delete('/api/admin/categories/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Category WHERE CategoryID = ?';

  try {
    const [results] = await db.query(query, [id]);
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//PRODUCT ROUTES
// Get all products
// Get all products
app.get('/api/admin/products', async (req, res) => {
  const query = `
      SELECT Product.*, Category.Title AS CategoryName
      FROM Product
      JOIN Category ON Product.CategoryID = Category.CategoryID
      ORDER BY product.productid
  `;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new product
app.post('/api/admin/products',async  (req, res) => {
  const {
    Title,
    Model,
    Description,
    Stock,
    CategoryID,
    Manufacturer,
    Features,
    Price,
    StockStatus,
    Dimensions,
  } = req.body;

  // Ensure required fields are provided
  if (!Title || !Stock || !CategoryID || !Price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = `
    INSERT INTO Product (Title, Model, Description, Stock, CategoryID, Manufacturer, Features, Price,   StockStatus, Dimensions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [results] =await  db.query(query, [
      Title, Model, Description, Stock, CategoryID, Manufacturer, Features, Price,  StockStatus, Dimensions
    ]);
    res.json({ message: 'Product added successfully', ProductID: results.insertId });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an existing product
// Update an existing product
app.put('/api/admin/products/:id', async (req, res) => {
  const {
    Title,
    Model,
    Description,
    Stock,
    CategoryID,
    Manufacturer,
    Features,
    Price,
    ImageURL,
    Rating,
    StockStatus,
    Dimensions,
  } = req.body;
  const { id } = req.params;

  // Check if required fields are provided
  if (!Title || !Stock || !CategoryID || !Price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = `
    UPDATE Product
    SET Title = ?, Model = ?, Description = ?, Stock = ?, CategoryID = ?, Manufacturer = ?, Features = ?, Price = ?, ImageURL = ?, Rating = ?, StockStatus = ?, Dimensions = ?
    WHERE ProductID = ?
  `;
  
  try {
    // Perform the update query
    const [results] = await db.query(query, [
      Title, Model, Description, Stock, CategoryID, Manufacturer, Features, Price, ImageURL, Rating, StockStatus, Dimensions, id
    ]);

    // Check if any rows were updated
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found or no changes were made' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a product
app.delete('/api/admin/products/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Product WHERE ProductID = ?';

  try {
    // Perform the delete query
    const [results] = await db.query(query, [id]);

    // Check if any rows were deleted
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Get all orders
app.get('/api/admin/orders', async (req, res) => {
  const query = `
    SELECT 
      Orders.OrderID, 
      Orders.CustomerID, 
      Orders.OrderDate, 
      Orders.OrderStatus, 
      Orders.TotalAmount, 
      Orders.ShippingAddress
    FROM Orders
  `;
  try {
    const [results] = await db.query(query);
    const formattedResults = results.map(order => ({
      ...order,
      TotalAmount: parseFloat(order.TotalAmount),
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order status
app.put('/api/admin/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  // Ensure that the 'status' is provided in the request
  if (!status) {
    return res.status(400).json({ message: 'Order status is required' });
  }

  const query = `
    UPDATE Orders
    SET OrderStatus = ?
    WHERE OrderID = ?
  `;

  try {
    const [results] = await db.query(query, [status, orderId]);

    // Check if the order was updated
    if (results.affectedRows > 0) {
      res.json({ message: 'Order status updated successfully.' });
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Search orders by customer ID
// Search orders by customer ID
app.get('/api/admin/orders/search', async (req, res) => {
  const { customerId } = req.query;  // Retrieve customerId from the query params
  
  const query = `
      SELECT 
          Orders.OrderID, 
          Orders.CustomerID, 
          Orders.OrderDate, 
          Orders.OrderStatus, 
          Orders.TotalAmount, 
          Orders.ShippingAddress,
          GROUP_CONCAT(
              CONCAT(OrderItem.ProductID, ':', OrderItem.Quantity, ':', OrderItem.Price)
              ORDER BY OrderItem.ProductID
              SEPARATOR '; '
          ) AS OrderItems
      FROM Orders
      JOIN OrderItem ON Orders.OrderID = OrderItem.OrderID
      WHERE Orders.CustomerID = ?
      GROUP BY Orders.OrderID, Orders.CustomerID, Orders.OrderDate, Orders.OrderStatus, Orders.TotalAmount, Orders.ShippingAddress
  `;

  try {
    // Perform the query using Promise API
    const [results] = await db.query(query, [customerId]);

    // Ensure TotalAmount is returned as a number and handle other formatting
    const formattedResults = results.map(order => ({
      ...order,
      TotalAmount: parseFloat(order.TotalAmount), // Convert TotalAmount to a number
      // OrderItem.Price may be part of the concatenated field, so it's treated differently if necessary
    }));

    console.log('Formatted orders:', formattedResults); // Debugging log
    res.json(formattedResults);
  } catch (err) {
    console.error('Error searching orders:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get items for a specific order
app.get('/api/admin/orders/:id/items', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      OrderItem.ProductID,
      OrderItem.Quantity,
      OrderItem.Price
    FROM OrderItem
    WHERE OrderItem.OrderID = ?
  `;
  try {
    const [results] = await db.query(query, [id]);
    const formattedResults = results.map(item => ({
      ...item,
      Price: parseFloat(item.Price),
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('Error fetching order items:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//CUSTOMERS ROUTES
// Get all customers
// Get all customers
app.get('/api/admin/customers', async (req, res) => {
  const query = `
    SELECT 
      CustomerID, 
      FirstName, 
      LastName, 
      Email, 
      Address, 
      Phone 
    FROM Customer
  `;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//REVIEW ROUTES
//get reviews
// Get all reviews
app.get('/api/admin/reviews', async (req, res) => {
  const query = `
    SELECT 
      Review.ReviewID, 
      Customer.FirstName AS CustomerName, 
      Product.Title AS ProductName, 
      Review.Rating, 
      Review.ReviewText, 
      Review.ReviewDate
    FROM Review
    JOIN Customer ON Review.CustomerID = Customer.CustomerID
    JOIN Product ON Review.ProductID = Product.ProductID
    ORDER BY Review.ReviewID
  `;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a review
app.delete('/api/admin/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const query = 'DELETE FROM Review WHERE ReviewID = ?';

  try {
    const [results] = await db.query(query, [reviewId]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});