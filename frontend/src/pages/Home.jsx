import { useState, useEffect } from 'react';
import api from '../api/axios';
import CafeCard from '../components/CafeCard';
import { Compass, Filter, MapPinOff, Loader2, Sparkles, Search, Bot } from 'lucide-react';


const Home = () => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  
  // AI Search States
  const [aiQuery, setAiQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [appliedAIFilters, setAppliedAIFilters] = useState(null);

  // Filters
  const [radius, setRadius] = useState(2000);
  const [maxPrice, setMaxPrice] = useState(4);

  useEffect(() => {
    fetchCafes();
  }, [radius, maxPrice]);

  const fetchCafes = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { longitude, latitude } = position.coords;
          const { data } = await api.get('/cafes', {
            params: {
              lng: longitude,
              lat: latitude,
              radius,
              maxPrice: maxPrice === 4 ? '' : maxPrice
            }
          });
          setCafes(data.data);
        } catch (err) {
          console.error(err);
          setLocationError('Failed to fetch nearby cafes. Please try again later.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setLocationError('Please allow location access to find nearby cafes.');
        setLoading(false);
      }
    );
  };

  const handleAISearch = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) {
      setAppliedAIFilters(null);
      return fetchCafes();
    }

    setLoading(true);
    setIsAiSearching(true);
    setLocationError(null);
    setAppliedAIFilters(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      setIsAiSearching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { longitude, latitude } = position.coords;
          const { data } = await api.post('/cafes/ai-search', {
            query: aiQuery,
            lng: longitude,
            lat: latitude,
            radius
          });
          setCafes(data.data);
          if (data.ai_filters && (data.ai_filters.genre || data.ai_filters.maxPrice)) {
            setAppliedAIFilters(data.ai_filters);
          } else {
            setAppliedAIFilters({ none: "Broad Search (No strict parameters inferred)" });
          }
        } catch (err) {
          console.error(err);
          setLocationError('AI Search failed. Please try again later.');
        } finally {
          setLoading(false);
          setIsAiSearching(false);
        }
      },
      (err) => {
        console.error(err);
        setLocationError('Please allow location access to use AI search.');
        setLoading(false);
        setIsAiSearching(false);
      }
    );
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="flex-1 w-full lg:max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Nearby Cafes</span></h1>
          
          <form onSubmit={handleAISearch} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 outline-none text-slate-700 py-3.5 pl-11 pr-4 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                placeholder="Ask AI: 'Find me cheap bakery items nearby...'"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isAiSearching}
              className="group whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAiSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              {isAiSearching ? 'Asking Mind...' : 'Smart Search'}
            </button>
          </form>
          
          {appliedAIFilters && (
            <div className="mt-4 flex items-center gap-2 flex-wrap text-sm text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 inline-flex">
              <Bot className="w-4 h-4" />
              <span className="font-semibold">AI Filtered For:</span>
              {appliedAIFilters.none ? (
                 <span className="opacity-90">{appliedAIFilters.none}</span>
              ) : (
                <>
                  {appliedAIFilters.genre && <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-indigo-100">{appliedAIFilters.genre}</span>}
                  {appliedAIFilters.maxPrice && <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-indigo-100">Max Price: {'$'.repeat(appliedAIFilters.maxPrice)}</span>}
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-slate-600 pl-3 hidden sm:flex">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold mr-1">Filters</span>
          </div>
          <select 
            className="flex-1 sm:flex-none bg-slate-50 border-none outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium text-slate-700 py-2.5 pl-4 pr-10 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors appearance-none"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
          >
            <option value={1000}>Within 1km</option>
            <option value={2000}>Within 2km</option>
            <option value={5000}>Within 5km</option>
          </select>
          <select 
            className="flex-1 sm:flex-none bg-slate-50 border-none outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium text-slate-700 py-2.5 pl-4 pr-10 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors appearance-none"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
          >
            <option value={4}>Any Price</option>
            <option value={1}>$ (Budget)</option>
            <option value={2}>$$ (Moderate)</option>
            <option value={3}>$$$ (Expensive)</option>
          </select>
        </div>
      </div>

      {/* Content state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 border-dashed">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
          </div>
          <p className="text-slate-500 font-medium text-lg">Locating awesome cafes near you...</p>
        </div>
      ) : locationError ? (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center max-w-lg mx-auto mt-10 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef44440a_1px,transparent_1px),linear-gradient(to_bottom,#ef44440a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="relative">
            <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100 text-red-500 rotate-3 transition-transform hover:rotate-6">
              <MapPinOff className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Location Required</h3>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-sm mx-auto">{locationError}</p>
            <button onClick={fetchCafes} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-slate-900/20 active:scale-95">
              Try Again
            </button>
          </div>
        </div>
      ) : cafes.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 ring-8 ring-slate-50/50">
            <Compass className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">No cafes found nearby</h3>
          <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">Try expanding your search radius or changing your price filters to discover more hidden gems.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {cafes.map(cafe => (
            <CafeCard key={cafe._id} cafe={cafe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
