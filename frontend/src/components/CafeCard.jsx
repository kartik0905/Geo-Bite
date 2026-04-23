import { Star, MapPin, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const CafeCard = ({ cafe }) => {
  return (
    <Link to={`/cafes/${cafe._id}`} className="group block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 overflow-hidden">
      <div className="h-48 bg-slate-100 relative overflow-hidden">
        {/* Placeholder for cafe image, using CSS pattern or gradient for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-slate-700">{cafe.averageRating || 'New'}</span>
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm tracking-wide uppercase">
          {cafe.genre}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{cafe.name}</h3>
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span className="truncate">Near GEU Campus</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Coffee className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              {Array.from({ length: cafe.priceLevel }).map((_, i) => '$').join('')}
              <span className="text-slate-300">
                {Array.from({ length: 4 - cafe.priceLevel }).map((_, i) => '$').join('')}
              </span>
            </span>
          </div>
          <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1">
            View Details <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CafeCard;
