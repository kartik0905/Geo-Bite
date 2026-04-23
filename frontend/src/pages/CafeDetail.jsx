import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Star, MapPin, Coffee, ArrowLeft, MessageSquare, Send } from 'lucide-react';

const CafeDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    fetchCafeDetail();
  }, [id]);

  const fetchCafeDetail = async () => {
    try {
      const { data } = await api.get(`/cafes/${id}`);
      setCafe(data.data);
      setReviews(data.reviews || []);
    } catch (err) {
      setError('Failed to load cafe details.');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    setSubmitting(true);
    setReviewError(null);
    try {
      await api.post(`/cafes/${id}/reviews`, { rating, text: reviewText });
      setReviewText('');
      setRating(5);
      fetchCafeDetail(); // Refresh to get the new review and updated average rating
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center min-h-[calc(100vh-64px)] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium">Brewing details...</p>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{error || 'Cafe Not Found'}</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-2 bg-indigo-50 px-6 py-3 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-16">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/60" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-white/10">
                  {cafe.genre}
                </span>
                <span className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold border border-amber-500/20">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  {cafe.averageRating || 'New'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">{cafe.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <MapPin className="w-4 h-4 text-indigo-400" /> GEU Campus Area
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <Coffee className="w-4 h-4 text-indigo-400" />
                  <span className="tracking-widest">
                    <span className="text-white">{Array.from({ length: cafe.priceLevel }).map((_, i) => '$').join('')}</span>
                    <span className="opacity-30">{Array.from({ length: 4 - cafe.priceLevel }).map((_, i) => '$').join('')}</span>
                  </span>
                </div>
              </div>
            </div>
            {user && (
              <a href="#review-form" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 whitespace-nowrap hidden md:inline-flex items-center gap-2">
                Write a Review <MessageSquare className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200">
          <div className="bg-indigo-50 p-3 rounded-2xl">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Community Reviews</h2>
          <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold">{reviews.length}</span>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center mb-10 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">No reviews yet</h3>
            <p className="text-slate-500 text-lg">Be the first to share your experience at {cafe.name}!</p>
          </div>
        ) : (
          <div className="space-y-6 mb-16">
            {reviews.map(review => (
              <div key={review._id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg border border-indigo-200">
                      U
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">Student User</h4>
                      <div className="text-sm font-medium text-slate-500">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-500' : 'fill-slate-200 text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        {user ? (
          <div id="review-form" className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden mt-10 scroll-mt-24">
            <div className="bg-slate-50 px-8 py-8 border-b border-slate-200">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Share Your Experience</h3>
              <p className="text-slate-500 mt-2 text-lg">Help other GEU students discover the best attributes of {cafe.name}.</p>
            </div>
            <form onSubmit={submitReview} className="p-8 sm:p-10">
              {reviewError && <div className="mb-8 p-4 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-pulse">{reviewError}</div>}
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Overall Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-3 rounded-2xl transition-all ${
                        star <= rating 
                          ? 'bg-amber-100 text-amber-600 scale-110 shadow-sm' 
                          : 'bg-slate-50 text-slate-300 hover:bg-amber-50 hover:text-amber-400'
                      }`}
                    >
                      <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Written Review</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-lg"
                  placeholder="What did you like about this cafe? How was the coffee?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-indigo-600/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {submitting ? 'Submitting...' : (
                  <>Post Review <Send className="w-5 h-5 ml-2" /></>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-10 text-center mt-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4xIj48L3JlY3Q+Cjwvc3ZnPg==')] opacity-60"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-indigo-900 mb-3 tracking-tight">Want to leave a review?</h3>
              <p className="text-indigo-700/80 mb-8 text-lg font-medium">Join the Geobite community to share your thoughts.</p>
              <Link to="/login" className="inline-block bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md hover:bg-indigo-50 transition-all active:scale-95">
                Sign In to Review
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeDetail;
