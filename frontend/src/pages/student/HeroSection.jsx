import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const searchHandler = (e) =>{
    e.preventDefault();
    if(searchQuery.trim() !== ''){
      navigate(`/course/search?query=${searchQuery}`); 
    }
    setSearchQuery('');
  }
  return (
    <div className='relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4 text-center'>
        <div className='mx-auto max-w-3xl'>
            <h1 className='text-4xl font-bold text-white mb-4'>Find the Best Courses for You</h1>
            <p className='text-gray-200 dark:text-gray-400 mb-8'>Discover, Learn, and Upskill with our wide range of courses</p>

            <form onSubmit={searchHandler} className='flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6'>
                <Input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you want to learn?"
                    className="flex-grow border-none focus-visible:ring-0 px-6 py-3 dark:text-gray-100 text-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
                <Button type="submit" className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">Search</Button>
            </form>
            <Button className="bg-white dark:bg-gray-800 text-blue-600 dark:text-white px-6 py-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => navigate(`/course/search?query=${''}`) }>Explore Courses</Button>
        </div>
    </div>
  )
}

export default HeroSection