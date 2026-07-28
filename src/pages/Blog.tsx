import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Blog {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  category: string;
  banner_image: string;
  publish_date: string;
  read_time: string;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          fetch('/api/admin-blogs?status=published'),
          fetch('/api/categories')
        ]);
        
        const blogData = await blogRes.json();
        const catData = await catRes.json();
        
        if (blogData.blogs) setBlogs(blogData.blogs);
        if (catData.categories) {
          setCategories(['All Categories', ...catData.categories.map((c: any) => c.name)]);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (blog.short_description && blog.short_description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All Categories' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  const isFiltering = searchQuery !== '' || selectedCategory !== 'All Categories';
  
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const recommendedBlogs = blogs.length > 1 ? blogs.slice(1, 6) : [];
  const remainingBlogs = blogs.length > 6 ? blogs.slice(6) : [];

  return (
    <>
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="section-label mb-4">Insights & Updates</div>
            <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight">
              Our <span className="text-cyber-teal">Blog</span>
            </h1>
          </div>
          
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-20">
            <div className="relative group z-50">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-cyber-teal transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal/50 transition-all"
              />
              
              {/* Search Suggestions Dropdown */}
              {searchQuery.trim() !== '' && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-[400px] bg-[#1a1d2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map(blog => (
                      <Link
                        key={blog.id}
                        to={`/blog/${blog.slug || blog.id}`}
                        className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/10">
                          {blog.banner_image ? (
                            <img src={blog.banner_image} className="w-full h-full object-cover" alt={blog.title} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-white truncate mb-1">{blog.title}</h4>
                          <p className="text-xs text-white/50 truncate uppercase tracking-wider">{blog.category || 'Uncategorized'}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-sm text-white/50 text-center">No results found for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full sm:w-48 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-left flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDown size={18} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoryOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#1a1d2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 max-h-64 overflow-y-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${selectedCategory === cat ? 'text-cyber-teal font-bold' : 'text-white/70'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-white/40 py-20">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-white/40 py-20">No blogs published yet.</div>
        ) : (
          <>
            {/* Default View (No filters) */}
            {!isFiltering ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                  {/* Left/Center: Featured Blog */}
                  {featuredBlog && (
                    <Link to={`/blog/${featuredBlog.slug || featuredBlog.id}`} className="lg:col-span-8 group block relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyber-teal/50 transition-colors min-h-[400px]">
                      {featuredBlog.banner_image && (
                        <div className="absolute inset-0 w-full h-full">
                          <img src={featuredBlog.banner_image} alt={featuredBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent"></div>
                        </div>
                      )}
                      <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                        <div className="flex items-center flex-wrap gap-3 text-xs font-bold text-cyber-teal uppercase tracking-wider mb-4">
                          {featuredBlog.category && <span className="bg-cyber-teal/20 px-3 py-1.5 rounded-md border border-cyber-teal/30">{featuredBlog.category}</span>}
                          <span>{new Date(featuredBlog.publish_date).toLocaleDateString()}</span>
                          {featuredBlog.read_time && <span className="flex items-center gap-1"><Clock size={12} /> {featuredBlog.read_time}</span>}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white group-hover:text-cyber-teal transition-colors leading-tight mb-4 line-clamp-3">
                          {featuredBlog.title}
                        </h2>
                        {featuredBlog.short_description && (
                          <p className="text-white/60 text-lg line-clamp-2 max-w-3xl mb-6">
                            {featuredBlog.short_description}
                          </p>
                        )}
                        <div className="inline-flex items-center gap-2 text-cyber-teal font-bold uppercase tracking-wider text-sm">
                          Read Article <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Right: Recommendations */}
                  {recommendedBlogs.length > 0 && (
                    <div className="lg:col-span-4 flex flex-col bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
                      <h3 className="text-xl font-display font-black uppercase text-white mb-6 border-b border-white/10 pb-4">
                        Recommended
                      </h3>
                      <div className="flex-1 flex flex-col gap-6">
                        {recommendedBlogs.map(blog => (
                          <Link key={blog.id} to={`/blog/${blog.slug || blog.id}`} className="group grid grid-cols-[100px_1fr] gap-4 items-center">
                            <div className="w-[100px] h-[75px] rounded-xl overflow-hidden bg-white/10 relative">
                              {blog.banner_image ? (
                                <img src={blog.banner_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-xs">No img</div>
                              )}
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-cyber-teal uppercase tracking-wider mb-1.5 line-clamp-1">
                                {blog.category || 'Uncategorized'} • {new Date(blog.publish_date).toLocaleDateString()}
                              </div>
                              <h4 className="text-sm font-bold text-white group-hover:text-cyber-teal transition-colors line-clamp-2 leading-snug">
                                {blog.title}
                              </h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Grid for Remaining Blogs */}
                {remainingBlogs.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-display font-black uppercase text-white mb-8 border-b border-white/10 pb-4">
                      More Articles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {remainingBlogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Filtered View */
              <div>
                <h3 className="text-xl font-display font-bold uppercase text-white/60 mb-8">
                  Showing results for {searchQuery ? `"${searchQuery}"` : selectedCategory} ({filteredBlogs.length})
                </h3>
                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-20 text-white/40 bg-white/5 rounded-3xl border border-white/10">
                    No blogs found matching your criteria.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  return (
    <Link to={`/blog/${blog.slug || blog.id}`} className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyber-teal/50 hover:bg-white/[0.07] transition-all hover:-translate-y-1 h-full">
      <div className="aspect-[16/10] w-full overflow-hidden bg-white/10 relative">
        {blog.banner_image ? (
          <img src={blog.banner_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold text-cyber-teal uppercase tracking-wider mb-3">
          {blog.category && <span className="bg-cyber-teal/10 px-2 py-1 rounded-md border border-cyber-teal/20">{blog.category}</span>}
          <span>{new Date(blog.publish_date).toLocaleDateString()}</span>
        </div>
        <h2 className="text-lg font-bold text-white group-hover:text-cyber-teal transition-colors line-clamp-2 mb-3">
          {blog.title}
        </h2>
        {blog.short_description && (
          <p className="text-sm text-white/60 line-clamp-2 mb-4 flex-1">
            {blog.short_description}
          </p>
        )}
        <div className="mt-auto text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors">
          Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
