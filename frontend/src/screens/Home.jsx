import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import Carousal from '../components/Carousal'

const Home = () => {
    const [foodItems, setFoodItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const loadFoodItems = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/foodData`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
                if (!response.ok) {
                    throw new Error('Food data could not be loaded')
                }
                setFoodItems(await response.json())
            } catch (requestError) {
                setError(requestError.message)
            } finally {
                setLoading(false)
            }
        }

        loadFoodItems()
    }, [])

    const filteredFoodItems = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return foodItems
        return foodItems.filter((foodItem) => [foodItem.name, foodItem.CategoryName, foodItem.description].some((value) => value?.toLowerCase().includes(term)))
    }, [foodItems, searchTerm])
    const categories = [...new Set(filteredFoodItems.map((foodItem) => foodItem.CategoryName))]

    return (
        <>
            <div>
                <div>
                    <Navbar />
                </div>
                <div>
                    <Carousal searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                </div>
                <div className='m-3'>
                    {loading && <p>Loading food items...</p>}
                    {error && <p className='text-danger'>{error}</p>}
                    {!loading && !error && foodItems.length === 0 && <p>No food items found.</p>}
                    {!loading && !error && searchTerm && filteredFoodItems.length === 0 && <p>No dishes found for "{searchTerm}".</p>}
                    {categories.map((category) => (
                        <section key={category} className='mb-5'>
                            <h2 className='text-success border-bottom pb-2'>{category}</h2>
                            <div className='row'>
                                {filteredFoodItems
                                    .filter((foodItem) => foodItem.CategoryName === category)
                                    .map((foodItem) => (
                                        <div className='col-12 col-md-6 col-lg-4 col-xl-3' key={foodItem._id || foodItem.name}>
                                            <Card foodItem={foodItem} />
                                        </div>
                                    ))}
                            </div>
                        </section>
                    ))}
                </div>
                <div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Home