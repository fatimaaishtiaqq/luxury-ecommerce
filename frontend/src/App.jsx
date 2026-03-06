import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';

import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import ProductList from './admin/pages/ProductList'; // to be created next
import CategoryList from './admin/pages/CategoryList'; // to be created next
import OrderList from './admin/pages/OrderList'; // to be created next
import CustomerList from './admin/pages/CustomerList'; // to be created next
import Analytics from './admin/pages/Analytics';
import AdminSettings from './admin/pages/Settings';

import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Shipping from './pages/Shipping';
import Careers from './pages/Careers';
import SizeGuide from './pages/SizeGuide';
import Sustainability from './pages/Sustainability';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* Admin Routes (No standard Navbar/Footer, strict layout) */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="categories" element={<CategoryList />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="customers" element={<CustomerList />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Storefront Routes (Standard Navbar/Footer wrapper) */}
                <Route path="*" element={
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow pt-24 pb-12 w-full container-padding section-spacing">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/collections/:category" element={<Collection />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/wishlist" element={<Wishlist />} />
                                <Route path="/account" element={<Auth />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/orders" element={<OrderHistory />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/faq" element={<FAQ />} />
                                <Route path="/shipping" element={<Shipping />} />
                                <Route path="/careers" element={<Careers />} />
                                <Route path="/size-guide" element={<SizeGuide />} />
                                <Route path="/sustainability" element={<Sustainability />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;
