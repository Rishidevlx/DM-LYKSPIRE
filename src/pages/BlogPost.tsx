import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin-blogs?id=${id}`);
        const data = await res.json();
        if (data.blog) {
          setBlog(data.blog);
        }
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-24 px-6 min-h-screen text-center text-white/40">Loading blog...</div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-24 px-6 min-h-screen text-center text-white/40">Blog not found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <article className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
        <Link to="/blog" className="inline-flex items-center gap-2 text-cyber-teal hover:text-white transition-colors font-bold uppercase tracking-widest text-xs mb-12">
          <ArrowLeft size={16} /> Back to Blogs
        </Link>
        
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-wider mb-6">
          {blog.category && <span className="bg-cyber-teal/10 px-2 py-1 rounded text-cyber-teal border border-cyber-teal/20">{blog.category}</span>}
          <span>{blog.publish_date ? new Date(blog.publish_date).toLocaleDateString() : 'Draft'}</span>
          {blog.read_time && <span>• {blog.read_time}</span>}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter uppercase mb-12 text-white leading-tight">
          {blog.title}
        </h1>

        {blog.banner_image && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12">
            <img src={blog.banner_image} alt={blog.alt_text || blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div 
          className="prose prose-invert prose-lg max-w-none 
          prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight
          prose-a:text-cyber-teal hover:prose-a:text-white prose-a:transition-colors
          prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
      <Footer />
    </>
  );
}
