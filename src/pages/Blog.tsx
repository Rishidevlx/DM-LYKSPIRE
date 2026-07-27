import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Blog {
  id: number;
  title: string;
  banner_image: string;
  publish_date: string;
  read_time: string;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/admin-blogs');
        const data = await res.json();
        if (data.blogs) {
          setBlogs(data.blogs);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="text-center mb-16">
          <div className="section-label mx-auto">Insights</div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mt-4">
            Our <span className="text-cyber-teal">Blog</span>
          </h1>
          <p className="text-white/60 mt-6 max-w-2xl mx-auto">
            Explore the latest strategies, insights, and trends in AI and business automation.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-white/40">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-white/40">No blogs published yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} to={`/blog/${blog.id}`} className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyber-teal/50 transition-colors">
                <div className="aspect-video w-full overflow-hidden bg-white/5 relative">
                  {blog.banner_image ? (
                    <img src={blog.banner_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center flex-wrap gap-3 text-xs font-bold text-cyber-teal uppercase tracking-wider mb-3">
                    {blog.category && <span className="bg-cyber-teal/10 px-2 py-1 rounded text-cyber-teal border border-cyber-teal/20">{blog.category}</span>}
                    <span>{blog.publish_date ? new Date(blog.publish_date).toLocaleDateString() : 'Draft'}</span>
                    {blog.read_time && <span>• {blog.read_time}</span>}
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-cyber-teal transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
